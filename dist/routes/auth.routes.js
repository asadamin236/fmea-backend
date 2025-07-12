"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
// Test route to check if auth routes are working
router.get("/test", (req, res) => {
    res.json({ message: "Auth routes are working!" });
});
// Simple test route
router.get("/ping", (req, res) => {
    res.json({ message: "Auth ping successful!" });
});
router.post("/signup", auth_controller_1.signup);
router.post("/login", auth_controller_1.login);
exports.default = router;
