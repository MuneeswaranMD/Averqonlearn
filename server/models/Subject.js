const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
    dept: String,
    year: String,
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Changed from instructor string to User ID
    instructorName: String, // Keeping name for easy display
    description: String,
    thumbnail: String,
    batches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }], // Subjects assigned to specific batches
    completionCriteria: {
        totalVideos: { type: Number, default: 0 }, // Auto-calculated usually, but good to have manual override or cache
        mandatoryExams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
        passingPercentage: { type: Number, default: 40 }
    }
}, { timestamps: true });

const Subject = mongoose.model('Subject', subjectSchema);

const contentSchema = new mongoose.Schema({
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['video', 'note'], required: true },
    url: String,
    thumbnail: String,
    duration: String,
    size: String,
    description: String,
    unit: { type: String, default: 'Unit 1' },
    isVisible: { type: Boolean, default: true },
    allowDownload: { type: Boolean, default: true }
}, { timestamps: true });

const Content = mongoose.model('Content', contentSchema);

module.exports = { Subject, Content };
