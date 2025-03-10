// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = mongoose.Schema({
//     username: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     role: {
//         type: String,
//         enum: ['Manager', 'Operator'],  // Restrict to these values
//         required: true,
//     },
//     department: {
//         type: String,
//         required: true, // e.g., Assembly, Quality Control
//     },
//     allowForStatusChange: {
//         type: Boolean,
//         default: false
//     }
// }, {
//     timestamps: true  // Adds createdAt and updatedAt fields
// });

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) {
//         next();
//     }

//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
// });

// // Method to compare passwords
// userSchema.methods.matchPassword = async function(enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

// const User = mongoose.model('User', userSchema);

// module.exports = User;

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Manager', 'Operator'],  // Restrict to these values
        required: true,
    },
    department: {
        type: String,
        required: true, // e.g., Assembly, Quality Control
    },
    allowForStatusChange: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true  // Adds createdAt and updatedAt fields
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

let User; // Declare the variable outside the if block

if (mongoose.models && mongoose.models.User) {
    User = mongoose.model('User'); // Model is already defined.  Get it.
} else {
    User = mongoose.model('User', userSchema); // Define the model.
}

module.exports = User;