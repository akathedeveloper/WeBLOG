const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
const upload = require("express-fileupload");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// ✅ CORS setup with hardcoded allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://weblog-tawny.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like curl or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Enable file uploads
app.use(upload());

// Serve uploaded files statically
app.use("/uploads", express.static(__dirname + "/uploads"));

// ✅ Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Backend is running!" });
});

// Main API routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB and start the server
connect(process.env.MONGO_URL)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`✅ Server running on port ${PORT}`)
    );
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
  });
