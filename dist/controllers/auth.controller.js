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
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("📝 Signup attempt:", req.body.email);
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            res.status(400).json({ error: "Email, name, and password are required" });
            return;
        }
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser) {
            res.status(409).json({ error: "User already exists" });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new user_model_1.default({ email, password: hashedPassword, name, role: "user" });
        yield newUser.save();
        console.log("✅ User registered successfully:", email);
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (err) {
        console.error("❌ Signup error:", err.message);
        res.status(500).json({ error: "Registration failed" });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("🔐 Login attempt:", req.body.email);
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required" });
            return;
        }
        // Check database connection
        const mongoose = require('mongoose');
        const dbState = mongoose.connection.readyState;
        console.log("📊 Database state:", dbState);
        if (dbState !== 1) {
            res.status(500).json({
                error: "Database connection error",
                message: "Database is not connected. Please try again later."
            });
            return;
        }
        const user = yield user_model_1.default.findOne({ email: email.toLowerCase() });
        if (!user) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            _id: user._id,
            role: user.role,
            email: user.email
        }, JWT_SECRET, {
            expiresIn: "24h",
        });
        console.log("✅ Login successful:", user.email);
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
        console.error("❌ Login error:", err.message);
        res.status(500).json({
            error: "Login failed",
            message: "Please try again later"
        });
    }
});
exports.login = login;
