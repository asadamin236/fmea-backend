"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Token missing or malformed" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "default_secret");
        // Optional: debug output to verify token structure
        console.log("✅ Decoded Token:", decoded);
        req.user = decoded;
        next();
    }
    catch (err) {
        console.error("❌ JWT verification failed:", err);
        res.status(401).json({ error: "Invalid token" });
        return;
    }
};
exports.authenticate = authenticate;
