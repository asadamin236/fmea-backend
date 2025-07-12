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
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../models/user.model"));
const router = (0, express_1.Router)();
router.post("/signup", auth_controller_1.signup);
router.post("/login", auth_controller_1.login);
// Test route to create a default user (only in development)
router.post("/create-test-user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (process.env.NODE_ENV === 'production') {
            res.status(403).json({ error: "Not allowed in production" });
            return;
        }
        const testEmail = "test@example.com";
        const testPassword = "password123";
        const testName = "Test User";
        // Check if user already exists
        const existingUser = yield user_model_1.default.findOne({ email: testEmail });
        if (existingUser) {
            res.status(409).json({
                message: "Test user already exists",
                email: testEmail,
                password: testPassword
            });
            return;
        }
        // Create test user
        const hashedPassword = yield bcryptjs_1.default.hash(testPassword, 10);
        const newUser = new user_model_1.default({
            email: testEmail,
            password: hashedPassword,
            name: testName,
            role: "admin"
        });
        yield newUser.save();
        res.status(201).json({
            message: "Test user created successfully",
            email: testEmail,
            password: testPassword,
            role: "admin"
        });
    }
    catch (error) {
        console.error("Test user creation error:", error);
        res.status(500).json({ error: "Failed to create test user" });
    }
}));
exports.default = router;
