const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    location: String,
    studentCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    commonPassword: {
        type: String, // For Students
        required: false
    },
    commonFacultyPassword: {
        type: String,
        required: false
    },
    commonPlacementPassword: {
        type: String,
        required: false
    },
    defaultThemeId: {
        type: String,
        default: 'indigo'
    }
}, {
    timestamps: true
});

// Hash common passwords before saving
collegeSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10);

    if (this.isModified('commonPassword')) {
        this.commonPassword = await bcrypt.hash(this.commonPassword, salt);
    }
    if (this.isModified('commonFacultyPassword')) {
        this.commonFacultyPassword = await bcrypt.hash(this.commonFacultyPassword, salt);
    }
    if (this.isModified('commonPlacementPassword')) {
        this.commonPlacementPassword = await bcrypt.hash(this.commonPlacementPassword, salt);
    }
});

const College = mongoose.model('College', collegeSchema);

module.exports = College;
