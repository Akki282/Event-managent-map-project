import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/db.js";

import "./grpc/grpcServer.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";

const app = express();

app.use(express.json());

connectDB();

// Express route
app.get("/", (req, res) => {
  res.send("Express API Running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/vendor", vendorRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`HTTP Server running on ${PORT}`);
});
