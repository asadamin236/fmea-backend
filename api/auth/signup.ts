import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../../src/config/db';
import bcrypt from 'bcryptjs';
import User from '../../src/models/user.model';

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
    console.log("📝 Signup attempt:", req.body?.email);
    
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, name, and password are required" });
    }

    // Connect to database
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, name, role: "user" });
    await newUser.save();

    console.log("✅ User registered successfully:", email);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err: any) {
    console.error("❌ Signup error:", err.message);
    return res.status(500).json({ error: "Registration failed" });
  }
} 