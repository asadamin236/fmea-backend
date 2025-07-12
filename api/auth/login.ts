import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../../src/config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../src/models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log("🔐 Login attempt:", req.body?.email);
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Connect to database
    await connectDB();
    
    // Check database connection
    const mongoose = require('mongoose');
    let dbState = mongoose.connection.readyState;
    console.log("📊 Database state:", dbState);
    
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
        return res.status(500).json({ 
          error: "Database connection error",
          message: "Unable to connect to database. Please try again later."
        });
      }
    }
    
    if (dbState !== 1) {
      return res.status(500).json({ 
        error: "Database connection error",
        message: "Database is not connected. Please try again later."
      });
    }
    
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
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
    return res.status(200).json({
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
    return res.status(500).json({ 
      error: "Login failed",
      message: "Please try again later"
    });
  }
} 