const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
    logo: String,
    website: String,
    industry: String,
    location: String
}, { timestamps: true });

const Partner = mongoose.model('Partner', partnerSchema);

const driveSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
    date: Date,
    location: String,
    package: String,
    eligibility: String,
    status: { type: String, default: 'Upcoming' }
}, { timestamps: true });

const Drive = mongoose.model('Drive', driveSchema);

const applicationSchema = new mongoose.Schema({
    driveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Drive', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
    status: { type: String, default: 'Applied' },
    resumeUrl: String
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);

module.exports = { Partner, Drive, Application };
