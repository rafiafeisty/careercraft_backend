const path=require("path")
const mongoose=require("mongoose")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const { Users } = require("../models/Users");
const { Company }=require('../models/Users')
const { Applied }=require('../models/Users')
const express=require("express")
const verifyToken = require('../middleware/auth');

require('dotenv').config();

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const userExist = await Users.findOne({ username });
        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPass = await bcrypt.hash(password, 10);
        
        const newUser = new Users({
            username,
            password: hashedPass
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const userFound = await Users.findOne({ username });
        if (!userFound) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: userFound._id },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

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

router.get('/portal',async(req,res)=>{
    const all_data=await Company.find()
    res.json(all_data) 
})

router.post('/apply',async (req, res) => {
  const { user_name, company_name, category,user_id} = req.body;
  const new_apply =await new Applied({ user_name, company_name, category, user_id });
  await new_apply.save();
  res.status(201).json("applied successfully");
});

router.get('/apply', async (req, res) => {
  const { user_id } = req.query;
  const all_data = await Applied.find({ user_id });

  if (!all_data.length) {
    res.status(400).json("Nothing is applied");
  } else {
    res.json(all_data);
  }
});

router.post("/testing",(req,res)=>{
    res.json("api is working")
})
module.exports = router;