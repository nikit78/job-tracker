import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const register = async (req, res) => {
  const data = registerSchema.parse(req.body);

  const exists = await User.findOne({ email: data.email });
  if (exists) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const user = await User.create(data);
  res.status(201).json({
    token: signToken(user._id),
    user: { id: user._id, name: user.name, email: user.email },
  });
};

export const login = async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    token: signToken(user._id),
    user: { id: user._id, name: user.name, email: user.email },
  });
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};