const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
    dept: String,
    year: String,
    instructor: String,
    description: String,
    thumbnail: String
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
    description: String
}, { timestamps: true });

const Content = mongoose.model('Content', contentSchema);

module.exports = { Subject, Content };
