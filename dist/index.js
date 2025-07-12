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
// Log environment variables (without sensitive data)
console.log("🔧 Environment check:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
console.log("ADMIN_SECRET_KEY exists:", !!process.env.ADMIN_SECRET_KEY);
// Connect to database
(0, db_1.connectDB)().then((dbConnected) => {
    app.locals.dbConnected = dbConnected;
    console.log("📊 Database connection status:", dbConnected);
});
const allowedOrigins = ["https://fmea-frontend.vercel.app", "http://localhost:5173", "http://localhost:3000"];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin);
        }
        else {
            console.log("🚫 CORS blocked origin:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use((0, cors_1.default)(corsOptions));
// ✅ This must be BEFORE routes
app.options("*", (0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
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
// Error handling middleware
app.use((err, req, res, next) => {
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
exports.default = app;
