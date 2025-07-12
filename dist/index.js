"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
// CORS Configuration
app.use((0, cors_1.default)({
    origin: ["https://fmea-frontend.vercel.app", "http://localhost:3000"],
    credentials: false,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
// Connect to MongoDB
(0, db_1.connectDB)().then((dbConnected) => {
    app.locals.dbConnected = dbConnected;
    console.log("📊 Database connection status:", dbConnected);
});
// Request logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const equipmentClass_routes_1 = __importDefault(require("./routes/equipmentClass.routes"));
const equipmentType_routes_1 = __importDefault(require("./routes/equipmentType.routes"));
const team_routes_1 = __importDefault(require("./routes/team.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const components_routes_1 = __importDefault(require("./routes/components.routes"));
const manufacturer_routes_1 = __importDefault(require("./routes/manufacturer.routes"));
app.use("/api/auth", auth_routes_1.default);
app.use("/api/equipment-class", equipmentClass_routes_1.default);
app.use("/api/equipment-types", equipmentType_routes_1.default);
app.use("/api/teams", team_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/components", components_routes_1.default);
app.use("/api/manufacturers", manufacturer_routes_1.default);
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
app.use((err, req, res, next) => {
    console.error("❌ Global error:", err);
    res.status(500).json({ error: "Internal server error" });
});
// 404
app.use("*", (req, res) => {
    res.status(404).json({ error: "Route not found" });
});
exports.default = app;
