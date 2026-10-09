import mongoose from "mongoose";
import { z } from "zod";
import Application from "../models/Application.js";

const STATUSES = ["applied", "interview", "offer", "rejected"];

const createSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  status: z.enum(STATUSES).optional(),
  location: z.string().optional(),
  salary: z.coerce.number().min(0).optional(),
  jobLink: z.string().optional(),
  appliedDate: z.coerce.date().optional(),
  interviewDate: z.coerce.date().optional(),
});
const updateSchema = createSchema.partial();
const noteSchema = z.object({
  text: z.string().trim().min(1).max(2000),
});

const listSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  status: z.enum(STATUSES).optional(),
  search: z.string().optional(),
  sort: z.enum(["newest", "oldest", "company"]).default("newest"),
});

const SORTS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  company: { company: 1 },
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const listApplications = async (req, res) => {
  const { page, limit, status, search, sort } = listSchema.parse(req.query);

  const filter = { user: req.user._id };
  if (status) filter.status = status;
  if (search) {
    const rx = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ company: rx }, { role: rx }];
  }

  const [data, total] = await Promise.all([
    Application.find(filter)
      .sort(SORTS[sort])
      .skip((page - 1) * limit)
      .limit(limit),
    Application.countDocuments(filter),
  ]);

  res.json({ data, page, pages: Math.ceil(total / limit), total });
};

export const createApplication = async (req, res) => {
  const body = createSchema.parse(req.body);
  const app = await Application.create({ ...body, user: req.user._id });
  res.status(201).json(app);
};

export const getApplication = async (req, res) => {
  const app = await Application.findOne({ _id: req.params.id, user: req.user._id });
  if (!app) return res.status(404).json({ message: "Application not found" });
  res.json(app);
};

export const updateApplication = async (req, res) => {
  const body = updateSchema.parse(req.body);
  const app = await Application.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    body,
    { new: true, runValidators: true }
  );
  if (!app) return res.status(404).json({ message: "Application not found" });
  res.json(app);
};

export const deleteApplication = async (req, res) => {
  const app = await Application.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!app) return res.status(404).json({ message: "Application not found" });
  res.json({ message: "Deleted" });
};

export const addNote = async (req, res) => {
  const { text } = noteSchema.parse(req.body);
  const app = await Application.findOne({ _id: req.params.id, user: req.user._id });
  if (!app) return res.status(404).json({ message: "Application not found" });

  app.notes.push({ text });
  await app.save();
  res.status(201).json(app.notes.at(-1));
};

export const deleteNote = async (req, res) => {
  const app = await Application.findOne({ _id: req.params.id, user: req.user._id });
  if (!app) return res.status(404).json({ message: "Application not found" });

  const note = app.notes.id(req.params.noteId);
  if (!note) return res.status(404).json({ message: "Note not found" });

  note.deleteOne();
  await app.save();
  res.json({ message: "Note deleted" });
};

export const getStats = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);
  const [byStatus, byMonth, upcoming] = await Promise.all([
    Application.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Application.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$appliedDate" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Application.find({ user: userId, interviewDate: { $gte: new Date() } })
      .sort({ interviewDate: 1 })
      .limit(5),
  ]);

  res.json({ byStatus, byMonth, upcoming });
};
