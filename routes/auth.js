const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

 
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";

// Register Route - FIXED VERSION
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: "Username, email, and password are required" 
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({ 
        error: "Password must be at least 6 characters long" 
      });
    }

    // ✅ CHECK IF USER ALREADY EXISTS (EMAIL)
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ 
        error: "User with this email already exists" 
      });
    }

    // ✅ CHECK IF USERNAME ALREADY EXISTS
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ 
        error: "Username already taken" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new user
    const newUser = new User({ 
      username, 
      email, 
      password: hashedPassword 
    });
    
    const savedUser = await newUser.save();

    // ✅ GENERATE JWT TOKEN
    const token = jwt.sign(
      { 
        id: savedUser._id, 
        email: savedUser.email,
        username: savedUser.username
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return user data (password excluded by toJSON method) and token
    res.status(201).json({
      message: "User registered successfully",
      user: savedUser,
      token
    });

  } catch (err) {
    console.error("Registration error:", err);
    
    // Handle duplicate key errors specifically
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({ 
        error: `${field} already exists` 
      });
    }
    
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

// Login Route - FIXED VERSION
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email and password are required" 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // ✅ GENERATE JWT TOKEN
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        username: user.username
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ RETURN USER WITHOUT PASSWORD + TOKEN
    res.status(200).json({ 
      message: "Login successful", 
      user: user.toJSON(), // This automatically excludes password
      token
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// ✅ GET CURRENT USER ROUTE (for checking if logged in)
router.get("/me", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    res.json({ user: user.toJSON() });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = router;

 