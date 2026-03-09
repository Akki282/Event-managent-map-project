import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import { startGrpcServer } from "./grpcServer.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

connectDB();

// Express route
app.get("/", (req, res) => {
  res.send("Express API Running 🚀");
});

// Start gRPC
startGrpcServer();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`HTTP Server running on ${PORT}`);
});

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/event", eventRoutes);

app.use("/api/vendor", vendorRoutes);
