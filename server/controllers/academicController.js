const { Subject, Content } = require('../models/Subject');
const Batch = require('../models/Batch');

// Subjects
const getSubjects = async (req, res) => {
    const { collegeId, dept, year, instructorId } = req.query;
    const query = {};
    if (collegeId) query.collegeId = collegeId;

    // Role-based filtering
    if (req.user && req.user.role === 'student') {
        const studentCollegeId = req.user.collegeId;
        // Students see subjects assigned to their batches
        const myBatches = await Batch.find({ 
            collegeId: studentCollegeId, 
            studentIds: req.user._id,
            isActive: true 
        });
        const myBatchIds = myBatches.map(b => b._id);
        
        // Also allow falling back to Dept/Year if no batch restriction (legacy support)
        query.$or = [
            { batches: { $in: myBatchIds } },
            { 
                batches: { $exists: false }, // Legacy subjects with no batch restriction
                dept: req.user.dept,
                year: req.user.year
            },
            { batches: { $size: 0 }, dept: req.user.dept, year: req.user.year }
        ];
        query.collegeId = studentCollegeId; // Ensure college matching
    } else if (req.user && req.user.role === 'faculty') {
        // Faculty see subjects they teach
        query.instructorId = req.user._id;
    } else {
        // Admin or others can filter
        if (dept && dept !== 'All') query.dept = dept;
        if (year && year !== 'All') query.year = year;
        if (instructorId) query.instructorId = instructorId;
    }

    const subjects = await Subject.find(query).populate('batches', 'name');
    res.json(subjects);
};

const addSubject = async (req, res) => {
    const { title, description, thumbnail, batches, dept, year } = req.body;
    
    // If instructor info is missing in body, use logged in user
    const instructorId = req.user._id;
    const instructorName = req.user.displayName;

    const subject = await Subject.create({
        title,
        collegeId: req.user.collegeId,
        dept,
        year,
        instructorId,
        instructorName,
        description,
        thumbnail,
        batches // Array of Batch IDs
    });

    res.status(201).json(subject);
};

// Content
const deleteSubject = async (req, res) => {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    // Check ownership or admin
    if (req.user.role !== 'superAdmin' && req.user.role !== 'collegeAdmin') {
        if (subject.instructorId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this subject' });
        }
    }

    await subject.deleteOne();
    await Content.deleteMany({ subjectId: req.params.id });
    res.json({ message: 'Subject and content removed' });
};

const updateSubject = async (req, res) => {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    // Check ownership or admin
    if (req.user.role !== 'superAdmin' && req.user.role !== 'collegeAdmin' && subject.instructorId && subject.instructorId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    subject.title = req.body.title || subject.title;
    subject.description = req.body.description || subject.description;
    subject.batches = req.body.batches || subject.batches;
    subject.dept = req.body.dept || subject.dept;
    subject.year = req.body.year || subject.year;

    const updatedSubject = await subject.save();
    res.json(updatedSubject);
};

// Content
const getContent = async (req, res) => {
    const { subjectId, facultyId, type, collegeId } = req.query;
    const query = {};
    if (subjectId) query.subjectId = subjectId;
    if (facultyId) query.facultyId = facultyId;
    if (type) query.type = type;
    if (collegeId) query.collegeId = collegeId;

    // If searching by faculty, we must first find their subjects because content doesn't store instructorId directly
    if (facultyId) {
        const facultySubjects = await Subject.find({ instructorId: facultyId });
        const facultySubjectIds = facultySubjects.map(s => s._id);
        query.subjectId = { $in: facultySubjectIds };
        // Clean up query if facultyId was passed but we are using subjectId list
        delete query.facultyId;
    }

    // Students should only see visible content and content from their enrolled subjects
    if (req.user && req.user.role === 'student') {
        const studentCollegeId = req.user.collegeId;
        const myBatches = await Batch.find({ 
            collegeId: studentCollegeId, 
            studentIds: req.user._id,
            isActive: true 
        });
        const myBatchIds = myBatches.map(b => b._id);
        
        const studentDept = req.user.dept?.trim().toUpperCase();
        const studentYear = req.user.year?.toString().trim();

        const mySubjects = await Subject.find({ 
            $or: [
                { batches: { $in: myBatchIds } },
                { 
                    batches: { $exists: false }, 
                    dept: { $regex: new RegExp(`^${studentDept}$`, 'i') }, 
                    year: studentYear 
                },
                { 
                    batches: { $size: 0 }, 
                    dept: { $regex: new RegExp(`^${studentDept}$`, 'i') }, 
                    year: studentYear 
                }
            ]
        });
        const myAllowedIds = mySubjects.map(s => s._id.toString());
        
        // If a specific subject was requested, check if it's allowed
        if (subjectId) {
             if (!myAllowedIds.includes(subjectId.toString())) {
                  return res.json([]); 
             }
             query.subjectId = subjectId;
        } else {
             query.subjectId = { $in: myAllowedIds };
        }
        query.isVisible = true;
    }

    const content = await Content.find(query).populate('subjectId', 'title').sort({ createdAt: -1 });
    res.json(content);
};

const addContent = async (req, res) => {
    const content = await Content.create(req.body);
    res.status(201).json(content);
};

const updateContent = async (req, res) => {
    const content = await Content.findById(req.params.id).populate('subjectId');
    if (!content) return res.status(404).json({ message: 'Content not found' });

    // Verify ownership via subject instructor or checks
    // Simplification: Assume if they can edit subject they can edit content usually, 
    // or store creatorId on content. For now, rely on subject instructor check if possible
    // But content doesn't store creator directly, so we check subject.
    if (req.user.role !== 'superAdmin' && req.user.role !== 'collegeAdmin') {
        // If content subject instructor is not current user
         const subject = content.subjectId;
         if (subject && subject.instructorId && subject.instructorId.toString() !== req.user._id.toString()) {
             return res.status(401).json({ message: 'Not authorized' });
         }
    }

    content.title = req.body.title || content.title;
    content.description = req.body.description || content.description;
    content.unit = req.body.unit || content.unit;
    content.isVisible = req.body.isVisible !== undefined ? req.body.isVisible : content.isVisible;
    content.allowDownload = req.body.allowDownload !== undefined ? req.body.allowDownload : content.allowDownload;

    const updatedContent = await content.save();
    res.json(updatedContent);
};

const deleteContent = async (req, res) => {
    const content = await Content.findById(req.params.id).populate('subjectId');
    if (content) {
         // Ownership check
         if (req.user.role !== 'superAdmin' && req.user.role !== 'collegeAdmin') {
            const subject = content.subjectId;
            if (subject && subject.instructorId && subject.instructorId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
         }

        await content.deleteOne();
        res.json({ message: 'Content removed' });
    } else {
        res.status(404).json({ message: 'Content not found' });
    }
};

module.exports = { 
    getSubjects, addSubject, updateSubject, deleteSubject,
    getContent, addContent, updateContent, deleteContent 
};
