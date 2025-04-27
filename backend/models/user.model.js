const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        minLength: 2,
        maxLength: 50,
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please fill a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 8,
    },
    indexNumber: {
        type: String,
        unique: true,
        required: false, // Optional field
        sparse: true, // Uniqueness only applies to documents where the field exists
        validate: [
            {
                validator: function(v) {
                    // Skip validation if not provided
                    if (!v) return true;
                    return /^UGR\d{10}$/.test(v);
                },
                message: props => `${props.value} is not a valid index number format! Format should be UGR followed by 10 digits.`
            },
            {
                validator: function(v) {
                    // Skip validation if not provided
                    if (!v) return true;
                    
                    const allowedIndexNumbers = [
                        'UGR0202110312', 'UGR0202110315', 'UGR0202110313', 'UGR0202110334',
                        'UGR0202110320', 'UGR0202110333', 'UGR0202120027', 'UGR0202120028',
                        'UGR0202120031', 'UGR0202110006', 'UGR0402210132', 'UGR0402111248',
                        'UGR0402111239', 'UGR0202120017'
                    ];
                    
                    return allowedIndexNumbers.includes(v);
                },
                message: 'The provided index number is not in the authorized list.'
            }
        ]
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'contributor'], // Added contributor role
        default: 'user'
    }
}, {timestamps: true});

// Add a method to check if user can submit projects
userSchema.methods.canSubmitProjects = function() {
    return this.role === 'admin' || (this.indexNumber && this.indexNumber.trim() !== '');
};

const User = mongoose.model("User", userSchema);

module.exports = User;