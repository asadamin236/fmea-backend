"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
// Load environment variables
dotenv_1.default.config();
// Initialize Express app
const app = (0, express_1.default)();
// Connect to MongoDB
(0, db_1.connectDB)().then((dbConnected) => {
    app.locals.dbConnected = dbConnected;
    console.log("📊 Database connection status:", dbConnected);
    console.log("🔧 Environment check:");
    console.log("  - NODE_ENV:", process.env.NODE_ENV);
    console.log("  - MONGO_URI exists:", !!process.env.MONGO_URI);
    console.log("  - JWT_SECRET exists:", !!process.env.JWT_SECRET);
});
// Simple CORS configuration
app.use((0, cors_1.default)({
    origin: true,
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
// Add request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
// Route imports
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const equipmentClass_routes_1 = __importDefault(require("./routes/equipmentClass.routes"));
const equipmentType_routes_1 = __importDefault(require("./routes/equipmentType.routes"));
const team_routes_1 = __importDefault(require("./routes/team.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const components_routes_1 = __importDefault(require("./routes/components.routes"));
const manufacturer_routes_1 = __importDefault(require("./routes/manufacturer.routes"));
// Route registration
app.use("/api/auth", auth_routes_1.default);
app.use("/api/equipment-class", equipmentClass_routes_1.default);
app.use("/api/equipment-types", equipmentType_routes_1.default);
app.use("/api/teams", team_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use('/api/components', components_routes_1.default);
app.use("/api/manufacturers", manufacturer_routes_1.default);
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
app.use((err, req, res, next) => {
    console.error("❌ Global error:", err);
    res.status(500).json({ error: "Internal server error" });
});
app.use("*", (req, res) => {
    res.status(404).json({ error: "Route not found" });
});
exports.default = app;
