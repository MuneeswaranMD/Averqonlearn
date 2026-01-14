const College = require('../models/College');
const User = require('../models/User');

// @desc    Get all colleges
// @route   GET /api/colleges
// @access  Private/SuperAdmin
const getColleges = async (req, res) => {
    const colleges = await College.find({});
    res.json(colleges);
};

// @desc    Register a college
// @route   POST /api/colleges
// @access  Private/SuperAdmin
const registerCollege = async (req, res) => {
    const { name, code, location, adminData } = req.body;

    const collegeExists = await College.findOne({ code });

    if (collegeExists) {
        res.status(400).json({ message: 'College code already exists' });
        return;
    }

    const college = await College.create({
        name,
        code,
        location
    });

    if (college && adminData) {
        try {
            await User.create({
                displayName: adminData.name,
                email: adminData.email,
                password: adminData.password,
                role: 'collegeAdmin',
                collegeId: college._id,
                collegeName: college.name
            });
        } catch (err) {
            console.error("Admin creation failed during college registration:", err);
            // Optionally we could delete the college here or just return a partial success
        }
    }

    res.status(201).json(college);
};

// @desc    Update college
// @route   PUT /api/colleges/:id
// @access  Private/SuperAdmin
const updateCollege = async (req, res) => {
    const college = await College.findById(req.params.id);

    if (college) {
        college.name = req.body.name || college.name;
        college.location = req.body.location || college.location;
        college.status = req.body.status || college.status;

        const updatedCollege = await college.save();
        res.json(updatedCollege);
    } else {
        res.status(404).json({ message: 'College not found' });
    }
};

// @desc    Delete college
// @route   DELETE /api/colleges/:id
// @access  Private/SuperAdmin
const deleteCollege = async (req, res) => {
    const college = await College.findById(req.params.id);

    if (college) {
        await college.deleteOne();
        // Optionally delete all users associated with this college
        await User.deleteMany({ collegeId: req.params.id });
        res.json({ message: 'College and associated users removed' });
    } else {
        res.status(404).json({ message: 'College not found' });
    }
};

module.exports = {
    getColleges,
    registerCollege,
    updateCollege,
    deleteCollege
};
