const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    type: { type: String, enum: ['MCQ', 'Coding'], required: true },
    text: { type: String, required: true },
    options: [String], // Only for MCQ
    correctAnswer: String, // String for MCQ answer or index
    // Advanced Coding Fields
    languages: [String], // Allowed languages for coding
    testCases: [{
        input: String,
        output: String,
        isHidden: { type: Boolean, default: true }
    }],
    timeLimit: { type: Number, default: 2 }, // seconds
    memoryLimit: { type: Number, default: 256 }, // MB
    points: { type: Number, default: 1 },
    starterCode: { type: String } // Pre-filled code for the editor
});

const examSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, enum: ['Aptitude', 'Coding', 'Technical', 'Company-Mock'], required: true },
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
    dept: String,
    year: String,
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
    scheduledDate: { type: Date, required: true },
    duration: { type: Number, required: true }, // in minutes
    passingCriteria: { type: Number, default: 40 }, // percentage
    negativeMarking: { type: Number, default: 0 },
    
    // Security Rules
    rules: {
        fullscreenRequired: { type: Boolean, default: true },
        maxWarnings: { type: Number, default: 3 },
        autoSubmitOnExit: { type: Boolean, default: false },
        disableCopyPaste: { type: Boolean, default: true }
    },
    
    questions: [questionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Draft', 'Active', 'Completed'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
