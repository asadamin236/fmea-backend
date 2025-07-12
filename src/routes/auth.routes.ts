import { Router } from "express";
import { signup, login } from "../controllers/auth.controller";
import bcrypt from "bcryptjs";
import User from "../models/user.model";

const router = Router();

// Test route to check if auth routes are working
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes are working!" });
});

router.post("/signup", signup);
router.post("/login", login);

export default router;
