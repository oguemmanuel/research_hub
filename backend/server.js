const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes.js");
const projectRoutes = require("./routes/project.routes.js");
const cookieParser = require('cookie-parser');
const fs = require('fs');

// Load environment variables
dotenv.config();

const connectToDatabase = require("./database/mongodb.js");

const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // Allow sending of cookies (sessions)
}));
app.use(cookieParser());

// Set up session middleware at the app level (remove from auth routes)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback_secret_key_for_dev',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
    name: 'sessionId',
  })
);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Uploads directory created');
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", projectRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});




// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        await connectToDatabase();
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
});