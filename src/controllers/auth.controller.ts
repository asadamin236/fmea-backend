import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "default_admin_key";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, role = "user", adminKey } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: "Email, name, and password are required" });
      return;
    }

    if (role === "admin" && adminKey?.trim() !== ADMIN_SECRET_KEY?.trim()) {
      res.status(403).json({ error: "Unauthorized to create admin user" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, name, role });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    console.log("🔍 Attempting to find user with email:", email);
    
    const user = await User.findOne({ email });
    console.log("👤 User found:", user ? "Yes" : "No");
    
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    console.log("🔐 Comparing passwords...");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("✅ Password valid:", isPasswordValid);
    
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    console.log("🎫 Generating JWT token...");
    const token = jwt.sign({ _id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
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
  } catch (err: any) {
    console.error("❌ Login error details:", err);
    console.error("❌ Error message:", err.message);
    console.error("❌ Error stack:", err.stack);
    res.status(500).json({ 
      error: "Login failed", 
      details: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};
