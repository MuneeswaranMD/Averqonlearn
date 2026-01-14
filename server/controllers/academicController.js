const { Subject, Content } = require('../models/Subject');

// Subjects
const getSubjects = async (req, res) => {
    const { collegeId, dept, year, instructorId } = req.query;
    const query = {};
    if (collegeId) query.collegeId = collegeId;
    if (dept && dept !== 'All') query.dept = dept;
    if (year && year !== 'All') query.year = year;
    if (instructorId) query.instructorId = instructorId;

    const subjects = await Subject.find(query);
    res.json(subjects);
};

const addSubject = async (req, res) => {
    const subject = await Subject.create(req.body);
    res.status(201).json(subject);
};

// Content
const getContent = async (req, res) => {
    const { subjectId, facultyId, type, collegeId } = req.query;
    const query = {};
    if (subjectId) query.subjectId = subjectId;
    if (facultyId) query.facultyId = facultyId;
    if (type) query.type = type;
    if (collegeId) query.collegeId = collegeId;

    const content = await Content.find(query);
    res.json(content);
};

const addContent = async (req, res) => {
    const content = await Content.create(req.body);
    res.status(201).json(content);
};

const deleteSubject = async (req, res) => {
    const subject = await Subject.findById(req.params.id);
    if (subject) {
        await subject.deleteOne();
        await Content.deleteMany({ subjectId: req.params.id });
        res.json({ message: 'Subject and content removed' });
    } else {
        res.status(404).json({ message: 'Subject not found' });
    }
};

const deleteContent = async (req, res) => {
    const content = await Content.findById(req.params.id);
    if (content) {
        await content.deleteOne();
        res.json({ message: 'Content removed' });
    } else {
        res.status(404).json({ message: 'Content not found' });
    }
};

module.exports = { getSubjects, addSubject, getContent, addContent, deleteSubject, deleteContent };
