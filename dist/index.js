"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
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
    mongoose_1.default
        .connect(mongoURI)
        .then(() => {
        console.log("✅ MongoDB connected successfully");
        dbConnected = true;
    })
        .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
        dbConnected = false;
    });
}
else {
    console.error("❌ MONGO_URI not found in environment variables");
}
// DB status route
app.get("/db-status", (req, res) => {
    const state = mongoose_1.default.connection.readyState;
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
exports.default = app;
