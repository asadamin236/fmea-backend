"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
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
        yield mongoose_1.default.connect(mongoURI, mongooseOptions);
        console.log("✅ MongoDB connected successfully");
        // Test the connection
        const dbState = mongoose_1.default.connection.readyState;
        console.log("📊 Database connection state:", dbState);
        console.log("📊 Database name:", mongoose_1.default.connection.name);
        console.log("📊 Database host:", mongoose_1.default.connection.host);
        return true;
    }
    catch (error) {
        console.error("❌ DB connection failed:");
        console.error("  - Error name:", error.name);
        console.error("  - Error message:", error.message);
        console.error("  - Error code:", error.code);
        // Log specific error types
        if (error.name === 'MongoServerSelectionError') {
            console.error("❌ Server selection failed - check network/IP allowlist");
        }
        else if (error.name === 'MongoParseError') {
            console.error("❌ Connection string parsing failed - check MONGO_URI format");
        }
        else if (error.name === 'MongoNetworkError') {
            console.error("❌ Network error - check internet connection and firewall");
        }
        else if (error.message.includes('Authentication failed')) {
            console.error("❌ Authentication failed - check username/password");
        }
        else if (error.message.includes('ECONNREFUSED')) {
            console.error("❌ Connection refused - check if MongoDB is running");
        }
        console.error("❌ Full error:", error);
        return false;
    }
});
exports.connectDB = connectDB;
// Add connection event listeners
mongoose_1.default.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
});
mongoose_1.default.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
});
mongoose_1.default.connection.on('connected', () => {
    console.log('✅ MongoDB connected');
});
mongoose_1.default.connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected');
});
