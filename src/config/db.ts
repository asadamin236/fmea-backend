import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.warn("⚠️ MongoDB URI is not defined in environment variables");
      return false;
    }

    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected");
    return true;
  } catch (error) {
    console.error("❌ DB connection failed:", error);
    return false;
  }
};
