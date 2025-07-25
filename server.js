const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const authRoutes = require('./routes/auth');
const cors = require('cors'); // Add this line

require('dotenv').config();
const app = express();

// Add CORS middleware
app.use(cors()); // This enables all CORS requests
// OR for more control:
app.use(cors({
  origin: 'https://careercraft-frontend-zeta.vercel.app/', // Your React app's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(express.static(path.join(__dirname, "public")));


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.error("MongoDB connection error:", err));



app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

