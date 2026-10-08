import { ZodError } from "zod";

export const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
    });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID" });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: "Duplicate value" });
  }
  console.error(err);
  res.status(500).json({ message: "Server error" });
};