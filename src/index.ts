import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// ✅ CORS middleware — use this first
app.use(
  cors({
    origin: ["https://fmea-frontend.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Handle preflight OPTIONS requests globally
app.options("*", cors());

app.use(express.json());

// Route imports
import authRoutes from "./routes/auth.routes";
import equipmentClassRoutes from "./routes/equipmentClass.routes";
import equipmentTypeRoutes from "./routes/equipmentType.routes";
import teamRoutes from "./routes/team.routes";
import userRoutes from "./routes/user.routes";

// Route registration
app.use("/api/auth", authRoutes); // 🔐 Auth (login/signup)
app.use("/api/equipment-class", equipmentClassRoutes);
app.use("/api/equipment-types", equipmentTypeRoutes);
app.use("/api/teams", teamRoutes); // 👥 Teams
app.use("/api/users", userRoutes); // 👤 Users

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
