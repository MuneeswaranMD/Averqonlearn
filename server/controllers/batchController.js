const Batch = require('../models/Batch');
const User = require('../models/User');

// @desc    Get all batches for a college
// @route   GET /api/batches
// @access  Private/CollegeAdmin/Faculty
const getBatches = async (req, res) => {
    const batches = await Batch.find({ collegeId: req.user.collegeId })
        .populate('facultyIds', 'displayName email')
        .populate('studentIds', 'displayName email rollNo');
    res.json(batches);
};

// @desc    Create a new batch
// @route   POST /api/batches
// @access  Private/CollegeAdmin
const createBatch = async (req, res) => {
    const { name, department, year, section, facultyIds, studentIds } = req.body;

    const batch = await Batch.create({
        name,
        collegeId: req.user.collegeId,
        department,
        year,
        section,
        facultyIds,
        studentIds,
        createdBy: req.user._id
    });

    res.status(201).json(batch);
};

// @desc    Update a batch
// @route   PUT /api/batches/:id
// @access  Private/CollegeAdmin
const updateBatch = async (req, res) => {
    const batch = await Batch.findById(req.params.id);

    if (batch && batch.collegeId.toString() === req.user.collegeId.toString()) {
        batch.name = req.body.name || batch.name;
        batch.facultyIds = req.body.facultyIds || batch.facultyIds;
        batch.studentIds = req.body.studentIds || batch.studentIds;
        
        const updatedBatch = await batch.save();
        res.json(updatedBatch);
    } else {
        res.status(404).json({ message: 'Batch not found or unauthorized' });
    }
};

// @desc    Delete a batch
// @route   DELETE /api/batches/:id
// @access  Private/CollegeAdmin
const deleteBatch = async (req, res) => {
    const batch = await Batch.findById(req.params.id);

    if (batch && batch.collegeId.toString() === req.user.collegeId.toString()) {
        await batch.deleteOne();
        res.json({ message: 'Batch removed' });
    } else {
        res.status(404).json({ message: 'Batch not found or unauthorized' });
    }
};

// @desc    Auto-populate students into batch based on criteria
// @route   POST /api/batches/:id/populate
// @access  Private/CollegeAdmin
const populateBatch = async (req, res) => {
    const { department, year, section } = req.body;
    const batchId = req.params.id;

    const query = { 
        collegeId: req.user.collegeId,
        role: 'student'
    };

    if (department) query.dept = department;
    if (year) query.year = year;
    // Section might need a specific field in User model if it's strictly followed, 
    // but often it's managed via these batches themselves. 
    // For now we assume we query by dept/year and add them.

    const students = await User.find(query).select('_id');
    const studentIds = students.map(s => s._id);

    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });

    // Add unique students
    const existing = batch.studentIds.map(id => id.toString());
    const newIds = studentIds.filter(id => !existing.includes(id.toString()));
    
    batch.studentIds = [...batch.studentIds, ...newIds];
    await batch.save();

    res.json({ message: `Added ${newIds.length} students to batch`, count: newIds.length });
};

module.exports = {
    getBatches,
    createBatch,
    updateBatch,
    deleteBatch,
    populateBatch
};
