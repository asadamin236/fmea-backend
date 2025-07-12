import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    console.log("🔧 Database connection attempt started");
    console.log("🔧 Environment check:");
    console.log("  - NODE_ENV:", process.env.NODE_ENV);
    console.log("  - MONGO_URI exists:", !!mongoURI);
    console.log("  - MONGO_URI length:", mongoURI ? mongoURI.length : 0);
    
    if (!mongoURI) {
      console.error("❌ MongoDB URI is not defined in environment variables");
      console.error("❌ Please set MONGO_URI in your environment variables");
      return false;
    }

    // Log first few characters of URI for debugging (without exposing credentials)
    const uriStart = mongoURI.substring(0, 20);
    const uriEnd = mongoURI.substring(mongoURI.length - 10);
    console.log("🔧 MONGO_URI format check:");
    console.log("  - Starts with:", uriStart);
    console.log("  - Ends with:", uriEnd);
    console.log("  - Contains 'mongodb':", mongoURI.includes('mongodb'));
    console.log("  - Contains '@':", mongoURI.includes('@'));

    console.log("🔗 Attempting to connect to MongoDB...");
    
    // Set mongoose options for better connection handling
    const mongooseOptions = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0,
    };
    
    console.log("🔧 Using mongoose options:", mongooseOptions);
    
    await mongoose.connect(mongoURI, mongooseOptions);
    console.log("✅ MongoDB connected successfully");
    
    // Test the connection
    const dbState = mongoose.connection.readyState;
    console.log("📊 Database connection state:", dbState);
    console.log("📊 Database name:", mongoose.connection.name);
    console.log("📊 Database host:", mongoose.connection.host);
    
    return true;
  } catch (error: any) {
    console.error("❌ DB connection failed:");
    console.error("  - Error name:", error.name);
    console.error("  - Error message:", error.message);
    console.error("  - Error code:", error.code);
    
    // Log specific error types
    if (error.name === 'MongoServerSelectionError') {
      console.error("❌ Server selection failed - check network/IP allowlist");
    } else if (error.name === 'MongoParseError') {
      console.error("❌ Connection string parsing failed - check MONGO_URI format");
    } else if (error.name === 'MongoNetworkError') {
      console.error("❌ Network error - check internet connection and firewall");
    } else if (error.message.includes('Authentication failed')) {
      console.error("❌ Authentication failed - check username/password");
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error("❌ Connection refused - check if MongoDB is running");
    }
    
    console.error("❌ Full error:", error);
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

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected');
});
