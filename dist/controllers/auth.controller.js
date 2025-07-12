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
exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "default_admin_key";
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name, role = "user", adminKey } = req.body;
        if (!email || !password || !name) {
            res.status(400).json({ error: "Email, name, and password are required" });
            return;
        }
        if (role === "admin" && (adminKey === null || adminKey === void 0 ? void 0 : adminKey.trim()) !== (ADMIN_SECRET_KEY === null || ADMIN_SECRET_KEY === void 0 ? void 0 : ADMIN_SECRET_KEY.trim())) {
            res.status(403).json({ error: "Unauthorized to create admin user" });
            return;
        }
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser) {
            res.status(409).json({ error: "User already exists" });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new user_model_1.default({ email, password: hashedPassword, name, role });
        yield newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: "Registration failed" });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("🔐 Login attempt started");
        console.log("📧 Request body:", { email: req.body.email, password: req.body.password ? "***" : "missing" });
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            console.log("❌ Missing email or password");
            res.status(400).json({ error: "Email and password are required" });
            return;
        }
        if (typeof email !== 'string' || typeof password !== 'string') {
            console.log("❌ Invalid email or password type");
            res.status(400).json({ error: "Email and password must be strings" });
            return;
        }
        if (email.trim() === '' || password.trim() === '') {
            console.log("❌ Empty email or password");
            res.status(400).json({ error: "Email and password cannot be empty" });
            return;
        }
        console.log("🔍 Attempting to find user with email:", email);
        // Check mongoose connection state
        const mongoose = require('mongoose');
        const dbState = mongoose.connection.readyState;
        console.log("📊 Database state:", dbState);
        if (dbState !== 1) {
            console.log("❌ Database not ready, state:", dbState);
            res.status(500).json({
                error: "Database connection error",
                message: "Database is not connected. Please try again later."
            });
            return;
        }
        const user = yield user_model_1.default.findOne({ email: email.toLowerCase() });
        console.log("👤 User found:", user ? "Yes" : "No");
        if (!user) {
            console.log("❌ User not found");
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }
        console.log("🔐 Comparing passwords...");
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        console.log("✅ Password valid:", isPasswordValid);
        if (!isPasswordValid) {
            console.log("❌ Invalid password");
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }
        console.log("🎫 Generating JWT token...");
        const token = jsonwebtoken_1.default.sign({
            _id: user._id,
            role: user.role,
            email: user.email
        }, JWT_SECRET, {
            expiresIn: "24h", // Increased token expiry
        });
        console.log("✅ Login successful for user:", user.email);
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (err) {
        console.error("❌ Login error details:", err);
        console.error("❌ Error message:", err.message);
        console.error("❌ Error stack:", err.stack);
        // Check for specific error types
        if (err.name === 'ValidationError') {
            res.status(400).json({ error: "Invalid input data" });
            return;
        }
        if (err.name === 'MongoError' || err.name === 'MongoServerError') {
            console.error("❌ MongoDB error during login:", err.message);
            res.status(500).json({
                error: "Database error occurred",
                message: "Please try again later"
            });
            return;
        }
        if (err.name === 'MongoNetworkError') {
            console.error("❌ MongoDB network error during login:", err.message);
            res.status(500).json({
                error: "Database connection error",
                message: "Please try again later"
            });
            return;
        }
        res.status(500).json({
            error: "Login failed",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});
exports.login = login;
