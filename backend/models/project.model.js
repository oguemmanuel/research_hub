const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, "Project name is required"],
    trim: true,
    minLength: 2,
    maxLength: 100
  },
  description: {
    type: String,
    required: [true, "Project description is required"],
    trim: true,
    minLength: 10
  },
  department: {
    type: String,
    required: [true, "Department is required"],
    trim: true
  },
  files: [{
    filename: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    }
  }],
  status: {
    type: String,
    enum: ['under review', 'approved', 'rejected'],
    default: 'under review'
  },
  adminMessage: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Modified pre-save middleware to check if the user has a valid index number or is an admin
projectSchema.pre('save', async function(next) {
  try {
    // Get the user from the database
    const User = mongoose.model('User');
    const user = await User.findById(this.userId);
    
    if (!user) {
      const error = new Error('User not found');
      return next(error);
    }
    
    // If user is admin, allow project creation
    if (user.role === 'admin') {
      return next();
    }
    
    // Check if the user has an index number
    if (!user.indexNumber) {
      const error = new Error('You need a valid index number to submit projects');
      return next(error);
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
      const error = new Error('You are not authorized to submit projects');
      return next(error);
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;