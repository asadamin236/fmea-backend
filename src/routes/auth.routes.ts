import { Router } from "express";
import { signup, login } from "../controllers/auth.controller";
import bcrypt from "bcryptjs";
import User from "../models/user.model";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

// Test route to create a default user (only in development)
router.post("/create-test-user", async (req: any, res: any) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      res.status(403).json({ error: "Not allowed in production" });
      return;
    }

    const testEmail = "test@example.com";
    const testPassword = "password123";
    const testName = "Test User";

    // Check if user already exists
    const existingUser = await User.findOne({ email: testEmail });
    if (existingUser) {
      res.status(409).json({ 
        message: "Test user already exists",
        email: testEmail,
        password: testPassword
      });
      return;
    }

    // Create test user
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    const newUser = new User({ 
      email: testEmail, 
      password: hashedPassword, 
      name: testName, 
      role: "admin" 
    });
    await newUser.save();

    res.status(201).json({ 
      message: "Test user created successfully",
      email: testEmail,
      password: testPassword,
      role: "admin"
    });
  } catch (error: any) {
    console.error("Test user creation error:", error);
    res.status(500).json({ error: "Failed to create test user" });
  }
});

export default router;
