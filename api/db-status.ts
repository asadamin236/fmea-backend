import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../src/config/db';

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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    const mongoose = require("mongoose");
    const dbState = mongoose.connection.readyState;
    
    return res.json({
      dbState,
      isConnected: dbState === 1,
      hasMongoURI: !!process.env.MONGO_URI,
      nodeEnv: process.env.NODE_ENV || "development",
      message: "Database status check completed"
    });
  } catch (error: any) {
    console.error("❌ DB status error:", error.message);
    return res.status(500).json({
      error: "Database status check failed",
      message: error.message
    });
  }
} 