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
        if (req.body.commonPassword) {
            college.commonPassword = req.body.commonPassword;
        }
        if (req.body.defaultThemeId) {
            college.defaultThemeId = req.body.defaultThemeId;
        }

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

// @desc    Update college settings (College Admin)
// @route   PUT /api/colleges/me
// @access  Private/CollegeAdmin
const updateMyCollege = async (req, res) => {
    try {
        if (!req.user.collegeId) {
            return res.status(400).json({ message: 'User is not associated with a college' });
        }

        const college = await College.findById(req.user.collegeId);

        if (college) {
            // Allow updating common settings
            if (req.body.commonPassword) {
                college.commonPassword = req.body.commonPassword;
            }
            if (req.body.commonFacultyPassword) {
                college.commonFacultyPassword = req.body.commonFacultyPassword;
            }
            if (req.body.commonPlacementPassword) {
                college.commonPlacementPassword = req.body.commonPlacementPassword;
            }
            if (req.body.defaultThemeId) {
                college.defaultThemeId = req.body.defaultThemeId;
            }
            // Can add more fields here if needed (e.g. logo)
            
            const updatedCollege = await college.save();
            res.json(updatedCollege);
        } else {
            res.status(404).json({ message: 'College not found' });
        }
    } catch (error) {
        console.error("Error updating college settings:", error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Get my college info
// @route   GET /api/colleges/me
// @access  Private/Admin
const getMyCollege = async (req, res) => {
    if (!req.user.collegeId) {
        return res.status(400).json({ message: 'User is not associated with a college' });
    }
    const college = await College.findById(req.user.collegeId);
    if (!college) {
        return res.status(404).json({ message: 'College not found' });
    }
    res.json(college);
};

module.exports = {
    getColleges,
    registerCollege,
    updateCollege,
    deleteCollege,
    updateMyCollege,
    getMyCollege
};
