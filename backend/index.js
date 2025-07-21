const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
const upload = require('express-fileupload')
require("dotenv").config();

const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')
const {notFound,errorHandler} = require('./middleware/errorMiddleware')

const app = express();

// Basic middleware
app.use(express.json({extended: true, limit: '10mb'}))
app.use(express.urlencoded({ extended: true, limit: '10mb' })); 

// CORS configuration - Update this for production
app.use(cors({
    credentials: true, 
    origin: [
        "http://localhost:3000",
        "https://your-vercel-domain.vercel.app", // Add your Vercel domain
        // Add your production domain when ready
    ]
}))

// File upload configuration for Cloudinary
app.use(upload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    limits: { 
        fileSize: 2 * 1024 * 1024 // 2MB limit
    },
    abortOnLimit: true,
    createParentPath: true,
    // Clean up temp files automatically
    safeFileNames: true,
    preserveExtension: true
}))

// Static files (keep for backward compatibility with old images)
app.use('/uploads', express.static(__dirname + '/uploads'))

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    })
})

// API routes
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Enhanced MongoDB connection with better error handling
const connectDB = async () => {
    try {
        const conn = await connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        })
        
        console.log(`MongoDB Connected: ${conn.connection.host}`)
        
        // Start server only after database connection
        const PORT = process.env.PORT || 5000
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
        })
        
    } catch (error) {
        console.error('Database connection error:', error.message)
        process.exit(1)
    }
}

// Handle MongoDB connection events
const mongoose = require('mongoose')

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err)
})

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected')
})

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...')
    await mongoose.connection.close()
    process.exit(0)
})

// Connect to database
connectDB()
