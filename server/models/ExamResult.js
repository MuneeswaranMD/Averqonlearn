const mongoose = require('mongoose');

const examResultSchema = new mongoose.Schema({
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true },
    totalScore: { type: Number, required: true },
    answers: [{
        questionId: mongoose.Schema.Types.ObjectId,
        userAnswer: String, // Code or MCQ Option
        language: String,   // If coding
        isCorrect: Boolean,
        pointsAwarded: Number,
        testCasesReached: Number,
        totalTestCases: Number,
        timeSpent: Number, // in seconds
        executionTime: Number, // If coding
        performanceBonus: { type: Number, default: 0 },
        feedback: String
    }],
    violations: [{
        type: { type: String }, // 'Fullscreen Exit', 'Tab Switch'
        timestamp: { type: Date, default: Date.now }
    }],
    activityLog: [{
        action: { type: String }, // 'Started', 'Resumed', 'Code Execution', 'Tab Switch', 'Fullscreen Exit'
        details: { type: String },
        timestamp: { type: Date, default: Date.now },
        isViolation: { type: Boolean, default: false }
    }],
    warningCount: { type: Number, default: 0 },
    status: { type: String, enum: ['Pass', 'Fail', 'Flagged'], required: true },
    submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('ExamResult', examResultSchema);
