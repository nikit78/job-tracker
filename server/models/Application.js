import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  { text: { type: String, required: true, trim: true } },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["applied", "interview", "offer", "rejected"],
      default: "applied",
    },
    location: { type: String, trim: true },
    salary: { type: Number, min: 0 },
    jobLink: { type: String, trim: true },
    appliedDate: { type: Date, default: Date.now },
    interviewDate: { type: Date },
    notes: [noteSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);