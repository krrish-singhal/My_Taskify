require("dotenv").config()
require('./config/passport.config'); 

// Check essential env variables
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET not found in .env")
  process.exit(1)
}
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env")
  process.exit(1)
}
console.log("✅ Environment variables loaded")

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const path = require("path")

// Import Routes
const authRoutes = require("./routes/auth")
const taskRoutes = require("./routes/tasks")
const userRoutes = require("./routes/users")

// Initialize Express App
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json({ limit: "30mb" }))
app.use(express.urlencoded({ extended: true, limit: "30mb" }))
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
)

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/users", userRoutes)

// Root Route
app.get("/", (req, res) => {
  res.send("🟢 API is running...")
})

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB")
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message)
  })

console.log("📦 index.js loaded successfully")
