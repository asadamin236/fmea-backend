import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB().then((dbConnected) => {
  app.locals.dbConnected = dbConnected;
  console.log("📊 Database connection status:", dbConnected);
  console.log("🔧 Environment check:");
  console.log("  - NODE_ENV:", process.env.NODE_ENV);
  console.log("  - MONGO_URI exists:", !!process.env.MONGO_URI);
  console.log("  - JWT_SECRET exists:", !!process.env.JWT_SECRET);
});

// Simple CORS configuration
app.use(cors({
  origin: true,
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Route imports
import authRoutes from "./routes/auth.routes";
import equipmentClassRoutes from "./routes/equipmentClass.routes";
import equipmentTypeRoutes from "./routes/equipmentType.routes";
import teamRoutes from "./routes/team.routes";
import userRoutes from "./routes/user.routes";
import componentRoutes from "./routes/components.routes";
import manufacturerRoutes from "./routes/manufacturer.routes";

// Route registration
app.use("/api/auth", authRoutes);
app.use("/api/equipment-class", equipmentClassRoutes);
app.use("/api/equipment-types", equipmentTypeRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/users", userRoutes);
app.use('/api/components', componentRoutes);
app.use("/api/manufacturers", manufacturerRoutes);

// Basic routes
app.get("/", (req, res) => {
  res.json({ message: "FMEA Backend is running!" });
});

// Database status route
app.get("/db-status", (req, res) => {
  const mongoose = require('mongoose');
  const dbState = mongoose.connection.readyState;
  res.json({
    dbState,
    isConnected: dbState === 1,
    hasMongoURI: !!process.env.MONGO_URI,
    nodeEnv: process.env.NODE_ENV || "development"
  });
});

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error("❌ Global error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;