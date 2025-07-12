import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";

dotenv.config();
const app = express();

// Log environment variables (without sensitive data)
console.log("🔧 Environment check:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
console.log("ADMIN_SECRET_KEY exists:", !!process.env.ADMIN_SECRET_KEY);

// Connect to database
connectDB().then((dbConnected) => {
  app.locals.dbConnected = dbConnected;
  console.log("📊 Database connection status:", dbConnected);
});

const allowedOrigins = ["https://fmea-frontend.vercel.app", "http://localhost:5173", "http://localhost:3000"];

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      console.log("🚫 CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// ✅ This must be BEFORE routes
app.options("*", cors(corsOptions));

app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Test route to check if server is working
app.get("/", (req, res) => {
  res.json({ 
    message: "FMEA Backend is running successfully! 🚀",
    timestamp: new Date().toISOString(),
    status: "OK",
    environment: process.env.NODE_ENV || "development"
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy",
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    mongoConnected: !!process.env.MONGO_URI
  });
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

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error("❌ Global error handler:");
  console.error("  - Error name:", err.name);
  console.error("  - Error message:", err.message);
  console.error("  - Error stack:", err.stack);
  console.error("  - Request URL:", req.url);
  console.error("  - Request method:", req.method);
  
  res.status(500).json({ 
    error: "Internal server error",
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method
  });
});

// 404 handler
app.use("*", (req, res) => {
  console.log("❌ 404 - Route not found:", req.method, req.url);
  res.status(404).json({ 
    error: "Route not found",
    path: req.url,
    method: req.method
  });
});

export default app;