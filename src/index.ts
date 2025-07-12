import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import componentRoutes from './routes/components.routes';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB().then((dbConnected) => {
  app.locals.dbConnected = dbConnected;
  console.log("📊 Database connection status:", dbConnected);
});

// CORS configuration for production
const allowedOrigins = [
  "http://localhost:3000", // Development
  "http://localhost:5000", // Main development port
  "http://localhost:8080", // Alternative dev port
  "https://fmea-frontend.vercel.app", // Production frontend
  "https://fmea-risk-insight-system.vercel.app", // Alternative production URL
];

const corsOptions = {
  origin: function (origin: any, callback: any) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());

// Route imports
import authRoutes from "./routes/auth.routes";
import equipmentClassRoutes from "./routes/equipmentClass.routes";
import equipmentTypeRoutes from "./routes/equipmentType.routes";
import teamRoutes from "./routes/team.routes";
import userRoutes from "./routes/user.routes";
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

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error("❌ Global error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;