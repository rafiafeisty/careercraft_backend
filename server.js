const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const authRoutes = require("./routes/auth");
const cors = require("cors");
require("dotenv").config();

// Create app
const app = express();

// CORS setup for Vercel frontend
app.use(cors({
  origin: 'https://careercraft-frontend-zeta.vercel.app', // ✅ Remove trailing slash
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);


// Basic route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Required for Vercel
module.exports = app;
