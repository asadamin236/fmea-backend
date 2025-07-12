import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("📝 Signup attempt:", req.body.email);
    
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: "Email, name, and password are required" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, name, role: "user" });
    await newUser.save();

    console.log("✅ User registered successfully:", email);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err: any) {
    console.error("❌ Signup error:", err.message);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("🔐 Login attempt:", req.body.email);
    
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    // Check database connection with retry logic
    const mongoose = require('mongoose');
    let dbState = mongoose.connection.readyState;
    console.log("📊 Database state:", dbState);
    
    // If not connected, try to connect
    if (dbState !== 1) {
      console.log("🔄 Attempting to reconnect to database...");
      try {
        await mongoose.connect(process.env.MONGO_URI!, {
          maxPoolSize: 1,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          bufferCommands: false,
          bufferMaxEntries: 0,
        });
        dbState = mongoose.connection.readyState;
        console.log("📊 Database state after reconnect:", dbState);
      } catch (dbError) {
        console.error("❌ Database reconnect failed:", dbError);
        res.status(500).json({ 
          error: "Database connection error",
          message: "Unable to connect to database. Please try again later."
        });
        return;
      }
    }
    
    if (dbState !== 1) {
      res.status(500).json({ 
        error: "Database connection error",
        message: "Database is not connected. Please try again later."
      });
      return;
    }
    
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { 
        _id: user._id, 
        role: user.role,
        email: user.email 
      }, 
      JWT_SECRET, 
      {
        expiresIn: "24h",
      }
    );

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
  } catch (err: any) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ 
      error: "Login failed",
      message: "Please try again later"
    });
  }
};
