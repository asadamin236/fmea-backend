import express, { Request, Response } from "express";
import serverless from "serverless-http";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "../src/config/db";

dotenv.config();

const app = express();

// Mongo connection
connectDB();

// Middleware
app.use(
  cors({
    origin: "*", // Change for production if needed
    credentials: true,
  })
);
app.use(express.json());

// Import routes
import authRoutes from "../src/routes/auth.routes";
import userRoutes from "../src/routes/user.routes";
import equipmentClassRoutes from "../src/routes/equipmentClass.routes";
import equipmentTypeRoutes from "../src/routes/equipmentType.routes";
import teamRoutes from "../src/routes/team.routes";

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/equipment-class", equipmentClassRoutes);
app.use("/api/equipment-types", equipmentTypeRoutes);
app.use("/api/teams", teamRoutes);

// Optional root test route
app.get("/", (req: Request, res: Response) => {
  res.send("API is working 🎉");
});

// Export the serverless handler
export const handler = serverless(app);

