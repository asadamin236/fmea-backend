"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
// Simple User Schema
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" }
}, { timestamps: true });
const User = mongoose_1.default.model("User", userSchema);
// Login route
app.post("/api/auth/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = yield User.findOne({ email: email.toLowerCase() });
        if (!user) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET || "default_secret", { expiresIn: "24h" });
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
    }
    catch (error) {
        console.error("❌ Login error:", error.message);
        res.status(500).json({ error: "Login failed" });
    }
}));
// Create test user route
app.post("/api/auth/create-test-user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (process.env.NODE_ENV === 'production') {
            res.status(403).json({ error: "Not allowed in production" });
            return;
        }
        const testEmail = "test@example.com";
        const testPassword = "password123";
        const testName = "Test User";
        const existingUser = yield User.findOne({ email: testEmail });
        if (existingUser) {
            res.json({
                message: "Test user already exists",
                email: testEmail,
                password: testPassword
            });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(testPassword, 10);
        const newUser = new User({
            email: testEmail,
            password: hashedPassword,
            name: testName,
            role: "admin"
        });
        yield newUser.save();
        res.json({
            message: "Test user created",
            email: testEmail,
            password: testPassword
        });
    }
    catch (error) {
        console.error("❌ Create test user error:", error.message);
        res.status(500).json({ error: "Failed to create test user" });
    }
}));
// 404 fallback
app.use("*", (req, res) => {
    res.status(404).json({ error: "Route not found" });
});
exports.default = app;
