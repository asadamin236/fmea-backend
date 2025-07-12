import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple health check without DB
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Backend running",
    timestamp: new Date().toISOString()
  });
});

// Test environment variables
app.get("/env-test", (req, res) => {
  res.json({
    hasMongoURI: !!process.env.MONGO_URI,
    mongoURILength: process.env.MONGO_URI ? process.env.MONGO_URI.length : 0,
    nodeEnv: process.env.NODE_ENV || "development",
    hasJWTSecret: !!process.env.JWT_SECRET
  });
});

// Try to connect to MongoDB
let dbConnected = false;
const mongoURI = process.env.MONGO_URI;

if (mongoURI) {
  console.log("🔗 Attempting MongoDB connection...");
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log("✅ MongoDB connected successfully");
      dbConnected = true;
    })
    .catch((err) => {
      console.error("❌ MongoDB connection failed:", err.message);
      dbConnected = false;
    });
} else {
  console.error("❌ MONGO_URI not found in environment variables");
}

// DB status route
app.get("/db-status", (req, res) => {
  const state = mongoose.connection.readyState;
  res.json({
    dbState: state,
    isConnected: state === 1,
    dbConnected: dbConnected,
    hasMongoURI: !!mongoURI
  });
});

// 404 fallback
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;