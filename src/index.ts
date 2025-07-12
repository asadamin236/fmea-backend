import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

// Simple User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

// Login route
app.post("/api/auth/login", async (req: any, res: any) => {
  try {
    console.log("🔐 Login attempt:", req.body.email);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ error: "Email and password required" });
      return;
    }
    
    if (!dbConnected) {
      res.status(500).json({ error: "Database not connected" });
      return;
    }
    
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "24h" }
    );
    
    console.log("✅ Login successful:", user.email);
    
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error: any) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({ error: "Login failed" });
  }
});

// Create test user route
app.post("/api/auth/create-test-user", async (req: any, res: any) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      res.status(403).json({ error: "Not allowed in production" });
      return;
    }
    
    const testEmail = "test@example.com";
    const testPassword = "password123";
    const testName = "Test User";
    
    const existingUser = await User.findOne({ email: testEmail });
    if (existingUser) {
      res.json({
        message: "Test user already exists",
        email: testEmail,
        password: testPassword
      });
      return;
    }
    
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    const newUser = new User({
      email: testEmail,
      password: hashedPassword,
      name: testName,
      role: "admin"
    });
    
    await newUser.save();
    
    res.json({
      message: "Test user created",
      email: testEmail,
      password: testPassword
    });
    
  } catch (error: any) {
    console.error("❌ Create test user error:", error.message);
    res.status(500).json({ error: "Failed to create test user" });
  }
});

// 404 fallback
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;