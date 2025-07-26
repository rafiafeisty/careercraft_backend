const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");
const serverless = require("serverless-http");
require("dotenv").config();

// Models
const { Users, Company, Applied } = require("../models/Users");

// Create app
const app = express();

// Middleware
app.use(cors({
  origin: 'https://careercraft-frontend-zeta.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Routes

// Root
app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get('/test', (req, res) => res.json({ message: 'Backend is working' }));

// Register
app.post('/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const userExist = await Users.findOne({ username });

    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new Users({ username, password: hashedPass });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const userFound = await Users.findOne({ username });

    if (!userFound || !(await bcrypt.compare(password, userFound.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: userFound._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({
      token,
      userId: userFound._id,
      username: userFound.username
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Get all companies
app.get('/auth/portal', async (req, res) => {
  try {
    const all_data = await Company.find();
    res.json(all_data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching companies" });
  }
});

// Apply to company
app.post('/auth/apply', async (req, res) => {
  try {
    const { user_name, company_name, category, user_id } = req.body;
    const new_apply = new Applied({ user_name, company_name, category, user_id });
    await new_apply.save();
    res.status(201).json("Applied successfully");
  } catch (error) {
    res.status(500).json({ message: "Application failed" });
  }
});

// Get applied companies by user_id
app.get('/auth/apply', async (req, res) => {
  try {
    const { user_id } = req.query;
    const all_data = await Applied.find({ user_id });

    if (!all_data.length) {
      res.status(400).json("Nothing is applied");
    } else {
      res.json(all_data);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching applied data" });
  }
});

// Test route
app.get("/auth/testing", (req, res) => {
  res.json("API is working");
});

// Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);
