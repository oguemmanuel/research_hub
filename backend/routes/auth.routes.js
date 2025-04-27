const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const rateLimit = require('express-rate-limit');
const User = require("../models/user.model")

dotenv.config();

// Updated input validation middleware to make index number optional
const validateUserInput = (req, res, next) => {
  const { email, password, name, indexNumber } = req.body;
  
  // For signup route - require email and password
  if (req.path === "/signup") {
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    
    // Validate index number only if provided
    if (indexNumber?.trim()) {
      const indexNumberRegex = /^UGR\d{10}$/;
      if (!indexNumberRegex.test(indexNumber)) {
        return res.status(400).json({ message: "Invalid index number format. Must be UGR followed by 10 digits" });
      }
      
      // Check if index number is in the allowed list
      const allowedIndexNumbers = [
        'UGR0202110312', 'UGR0202110315', 'UGR0202110313', 'UGR0202110334',
        'UGR0202110320', 'UGR0202110333', 'UGR0202120027', 'UGR0202120028',
        'UGR0202120031', 'UGR0202110006', 'UGR0402210132', 'UGR0402111248',
        'UGR0402111239', 'UGR0202120017'
      ];
      
      if (!allowedIndexNumbers.includes(indexNumber)) {
        return res.status(400).json({ message: "Index number not authorized" });
      }
    }
  }
  
  // For signin route - require either email or indexNumber, plus password
  if (req.path === "/signin") {
    if ((!email?.trim() && !indexNumber?.trim()) || !password?.trim()) {
      return res.status(400).json({ message: "Either email or index number, plus password are required" });
    }
    
    // Validate email format if provided
    if (email?.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
    }
    
    // Validate index number format if provided
    if (indexNumber?.trim()) {
      const indexNumberRegex = /^UGR\d{10}$/;
      if (!indexNumberRegex.test(indexNumber)) {
        return res.status(400).json({ message: "Invalid index number format. Must be UGR followed by 10 digits" });
      }
    }
  }
  
  // Password length check for both routes
  if (password && password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }
  
  next();
};

// Rate limiting setup
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: { message: 'Too many attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/signup", validateUserInput, async (req, res) => {
  try {
    const { name, email, password, indexNumber } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }
    
    // Check if index number is already in use (only if provided)
    if (indexNumber?.trim()) {
      const existingIndexNumber = await User.findOne({ indexNumber: indexNumber.trim() });
      if (existingIndexNumber) {
        return res.status(400).json({ message: "Index number is already registered" });
      }
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Determine user role based on indexNumber
    let role = 'user';
    if (indexNumber?.trim()) {
      role = 'contributor'; // Users with index numbers can contribute projects
    }
    
    // Create new user object with or without indexNumber
    const userData = {
      name: name?.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role
    };
    
    // Only add indexNumber if it was provided
    if (indexNumber?.trim()) {
      userData.indexNumber = indexNumber.trim();
    }
    
    const newUser = await User.create(userData);

    // Don't send password hash in response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    req.session.userId = newUser._id;
    
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: userResponse,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// The rest of the auth routes code remains unchanged
router.post("/signin", validateUserInput, authLimiter, async (req, res) => {
  try {
    const { email, password, indexNumber } = req.body;
    
    // Find user by email or index number
    const query = indexNumber?.trim() 
      ? { indexNumber: indexNumber.trim() } 
      : { email: email.toLowerCase().trim() };
    
    const user = await User.findOne(query);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Don't send password hash in response
    const userResponse = user.toObject();
    delete userResponse.password;

    req.session.userId = user._id;
    
    res.status(200).json({
      success: true,
      message: "Sign in successful",
      data: {
        user: userResponse,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/user-info", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("User info error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signout", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("Signout error:", err);
      return res.status(500).json({ message: "Failed to sign out" });
    }
    res.clearCookie('sessionId');
    res.status(200).json({ message: "Successfully signed out" });
  });
});

// Create admin route remains the same
router.post("/create-admin", async (req, res) => {
  try {
    const { name, email, password, indexNumber, secretKey } = req.body;
    
    // Check if SECRET_ADMIN_KEY environment variable is set and matches
    if (!process.env.SECRET_ADMIN_KEY || secretKey !== process.env.SECRET_ADMIN_KEY) {
      return res.status(401).json({ message: "Unauthorized: Invalid secret key" });
    }
    
    // Validate required fields
    if (!name?.trim() || !email?.trim() || !password?.trim() || !indexNumber?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    
    // Password length check
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }
    
    // Index number validation
    const indexNumberRegex = /^UGR\d{10}$/;
    if (!indexNumberRegex.test(indexNumber)) {
      return res.status(400).json({ message: "Invalid index number format. Must be UGR followed by 10 digits" });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { indexNumber }
      ]
    });
    
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email or index number" });
    }
    
    // Create admin user
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newAdmin = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      indexNumber: indexNumber.trim(),
      role: 'admin'
    });
    
    // Don't send password hash in response
    const adminResponse = newAdmin.toObject();
    delete adminResponse.password;
    
    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        user: adminResponse,
      },
    });
  } catch (error) {
    console.error("Admin creation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;