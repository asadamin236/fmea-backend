import mongoose from "mongoose";

export const connectDB = async (): Promise<boolean> => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ MONGO_URI not found in environment variables.");
    return false;
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB.");
    return true;
  } catch (error: any) {
    console.error("❌ MongoDB connection error:", error.message);
    return false;
  }
};
