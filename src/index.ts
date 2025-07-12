import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import serverless from "serverless-http";

dotenv.config();

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: ["https://fmea-frontend.vercel.app", "http://localhost:3000"],
    credentials: false,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Connect to MongoDB
connectDB().then((dbConnected) => {
  app.locals.dbConnected = dbConnected;
  console.log("📊 Database connection status:", dbConnected);
});

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
import authRoutes from "./routes/auth.routes";
import equipmentClassRoutes from "./routes/equipmentClass.routes";
import equipmentTypeRoutes from "./routes/equipmentType.routes";
import teamRoutes from "./routes/team.routes";
import userRoutes from "./routes/user.routes";
import componentRoutes from "./routes/components.routes";
import manufacturerRoutes from "./routes/manufacturer.routes";

app.use("/api/auth", authRoutes);
app.use("/api/equipment-class", equipmentClassRoutes);
app.use("/api/equipment-types", equipmentTypeRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/users", userRoutes);
app.use("/api/components", componentRoutes);
app.use("/api/manufacturers", manufacturerRoutes);

// Default route
app.get("/", (req, res) => {
  res.json({ message: "FMEA Backend is running!" });
});

// DB Status Route
app.get("/db-status", (req, res) => {
  const mongoose = require("mongoose");
  const dbState = mongoose.connection.readyState;
  res.json({
    dbState,
    isConnected: dbState === 1,
    hasMongoURI: !!process.env.MONGO_URI,
    nodeEnv: process.env.NODE_ENV || "development",
  });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("❌ Global error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// 404
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Export for Vercel serverless
export default app;
export const handler = serverless(app);

// Start server for local development
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}`);
    console.log(`🔍 Health check: http://localhost:${PORT}/db-status`);
  }).on('error', (err) => {
    console.error('❌ Server startup error:', err);
    process.exit(1);
  });
}
