const mongoose = require('mongoose');

const courseProgressSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed', 'Failed'],
        default: 'Not Started'
    },
    completionPercentage: { type: Number, default: 0 },
    
    // Detailed Video Progress
    watchedContent: [{
        contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content' },
        watchedDuration: Number, 
        isCompleted: { type: Boolean, default: false },
        lastAccess: { type: Date, default: Date.now }
    }],

    // Exam Metrics Cache (re-calculated from ExamResults)
    examMetrics: {
        averageScore: { type: Number, default: 0 },
        totalAttempts: { type: Number, default: 0 },
        passedExamsCount: { type: Number, default: 0 }
    },

    completedAt: Date,
    certificateUrl: String
}, { timestamps: true });

// Compound index to ensure one progress record per student per course
courseProgressSchema.index({ studentId: 1, subjectId: 1 }, { unique: true });

module.exports = mongoose.model('CourseProgress', courseProgressSchema);
