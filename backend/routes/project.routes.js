const express = require('express');
const Project = require('../models/project.model');
const User = require('../models/user.model');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/auth.middleware');

// Set up multer storage configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Step 1: Define the `checkIndexAuthorization` middleware
const checkIndexAuthorization = async (req, res, next) => {
  try {
    // Check if the user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // List of allowed index numbers
    const allowedIndexNumbers = [
      'UGR0202110312', 'UGR0202110315', 'UGR0202110313', 'UGR0202110334',
      'UGR0202110320', 'UGR0202110333', 'UGR0202120027', 'UGR0202120028',
      'UGR0202120031', 'UGR0202110006', 'UGR0402210132', 'UGR0402111248',
      'UGR0402111239', 'UGR0202120017'
    ];

    // Check if the user's index number is in the allowed list
    if (!allowedIndexNumbers.includes(user.indexNumber)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to submit projects. Only users with approved index numbers can submit projects.'
      });
    }

    next();
  } catch (error) {
    console.error('Authorization check error:', error);
    res.status(500).json({ success: false, message: 'Server error during authorization check' });
  }
};

// Step 2: Define Routes

// Route for submitting a project for admin approval
router.post('/projects/submit', authMiddleware, checkIndexAuthorization, upload.array('files'), async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    const { name, description, department } = req.body;

    if (!name || !description || !department || !req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const filesList = req.files.map(file => ({
      filename: file.filename,
      fileUrl: `/uploads/${file.filename}` // Create URL relative to your server
    }));

    const newProject = new Project({
      userId,
      name,
      description,
      department,
      files: filesList,
      status: 'under review',
    });

    await newProject.save();

    res.json({
      success: true,
      message: 'Project submitted for review',
      project: newProject
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error submitting project' });
  }
});

// Route to preview a PDF file for admin
router.get('/projects/preview/:projectId/:fileName', authMiddleware, async (req, res) => {
  try {
    const { projectId, fileName } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const file = project.files.find(f => f.filename === fileName);
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    const filePath = path.join(__dirname, '../uploads', fileName);
    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error previewing the file' });
  }
});

// Route for admin to approve a project
router.put('/projects/approve/:id', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body; // Admin's message
    const project = await Project.findByIdAndUpdate(req.params.id, {
      status: 'approved',
      adminMessage: message,
    }, { new: true });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, message: 'Project approved', project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error approving project' });
  }
});

// Route for admin to reject a project
router.put('/projects/reject/:id', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body; // Admin's message
    const project = await Project.findByIdAndUpdate(req.params.id, {
      status: 'rejected',
      adminMessage: message,
    }, { new: true });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, message: 'Project rejected', project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error rejecting project' });
  }
});

// Route to fetch all projects that are under review
router.get('/projects', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ status: 'under review' }).populate('userId', 'name email indexNumber');
    res.json({ success: true, projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching projects' });
  }
});

// Route to fetch all approved projects with optional department filter
router.get('/projects/approved', authMiddleware, async (req, res) => {
  try {
    const { department } = req.query;
    let query = { status: 'approved' };

    if (department) {
      query.department = department;
    }

    const projects = await Project.find(query).populate('userId', 'name email indexNumber');
    res.json({ success: true, projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching approved projects' });
  }
});

// Route for fetching user's own projects
router.get('/projects/my', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const projects = await Project.find({ userId });
    res.json({ success: true, projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching user projects' });
  }
});

module.exports = router;
