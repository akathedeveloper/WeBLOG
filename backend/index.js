const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
const upload = require("express-fileupload");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// Body parsers with size limits for Cloudinary
app.use(express.json({ extended: true, limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration with both local and production domains
const allowedOrigins = [
  "http://localhost:3000",
  "https://akathedeveloper-weblog.vercel.app",
  // Add more production domains as needed
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// File upload configuration for Cloudinary
app.use(upload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    limits: { 
        fileSize: 2 * 1024 * 1024 // 2MB limit
    },
    abortOnLimit: true,
    createParentPath: true,
    safeFileNames: true,
    preserveExtension: true
}));

// Static files (keep for backward compatibility with old images)
app.use("/uploads", express.static(__dirname + "/uploads"));

// Health check endpoints
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "Backend is running!",
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Enhanced MongoDB connection with better error handling
const connectDB = async () => {
    try {
        const conn = await connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        });
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        
        // Start server only after database connection
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`Health check: http://localhost:${PORT}/health`);
        });
        
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        process.exit(1);
    }
};

// Handle MongoDB connection events
const mongoose = require('mongoose');

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('🔄 Shutting down gracefully...');
    try {
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed');
    } catch (error) {
        console.error('❌ Error during shutdown:', error);
    }
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('🔄 SIGTERM received, shutting down gracefully...');
    try {
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed');
    } catch (error) {
        console.error('❌ Error during shutdown:', error);
    }
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Connect to database
connectDB();
