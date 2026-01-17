const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    name: {
        type: String, // e.g., "CSE - 2024 - Section A" or "Special Coding Batch"
        required: true
    },
    collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College',
        required: true
    },
    department: {
        type: String, // Optional, can be mixed
        default: null
    },
    year: {
        type: String, // Optional
        default: null
    },
    section: {
        type: String, // Optional
        default: null
    },
    facultyIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    studentIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Batch = mongoose.model('Batch', batchSchema);

module.exports = Batch;
