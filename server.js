const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const authRoutes = require('./routes/auth');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS Setup
app.use(cors({
  origin: '*', // You can replace this with specific frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(express.static(path.join(__dirname, "public")));

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.error("MongoDB connection error:", err));

module.exports = app;
