// src/index.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";

dotenv.config();
const app = express();

connectDB();

const allowedOrigins = [
  "http://localhost:5000",
  "https://fmea-frontend.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Routes
import authRoutes from "./routes/auth.routes";
import equipmentClassRoutes from "./routes/equipmentClass.routes";
import equipmentTypeRoutes from "./routes/equipmentType.routes";
import teamRoutes from "./routes/team.routes";
import userRoutes from "./routes/user.routes";
import componentRoutes from "./routes/component.routes";

app.use("/api/auth", authRoutes);
app.use("/api/equipment-class", equipmentClassRoutes);
app.use("/api/equipment-types", equipmentTypeRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/users", userRoutes);
app.use("/api/components", componentRoutes);

export default app; // ✅ Export app for serverless use
