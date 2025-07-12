import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.error("❌ MongoDB URI is not defined in environment variables");
      return false;
    }

    console.log("🔗 Attempting to connect to MongoDB...");
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected successfully");
    return true;
  } catch (error: any) {
    console.error("❌ DB connection failed:", error.message);
    return false;
  }
};

// Add connection event listeners
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected');
});