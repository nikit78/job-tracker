import dns from "node:dns";
import mongoose from "mongoose";

// Local workaround: Node's SRV lookup fails on some networks
dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
};