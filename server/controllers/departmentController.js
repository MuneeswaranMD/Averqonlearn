const Department = require('../models/Department');

// @desc    Get departments by college
// @route   GET /api/departments
// @access  Private
const getDepartments = async (req, res) => {
    const { collegeId } = req.query;
    const departments = await Department.find({ collegeId });
    res.json(departments);
};

// @desc    Add a department
// @route   POST /api/departments
// @access  Private/Admin
const addDepartment = async (req, res) => {
    const { name, collegeId, head } = req.body;
    const department = await Department.create({
        name,
        collegeId,
        head
    });
    res.status(201).json(department);
};

// @desc    Sync departments from student data
// @route   POST /api/departments/sync
// @access  Private/CollegeAdmin
const syncDepartments = async (req, res) => {
    const User = require('../models/User'); // Lazy load to avoid circular dependency if any
    const collegeId = req.user.collegeId;

    if (!collegeId) {
        return res.status(400).json({ message: 'User not associated with a college' });
    }

    // 1. Get all distinct departments from students in this college
    const studentDepts = await User.distinct('dept', { 
        collegeId: collegeId, 
        role: 'student',
        dept: { $ne: null } 
    });

    // 2. Get existing departments
    const existingDepts = await Department.find({ collegeId }).select('name');
    const existingNames = existingDepts.map(d => d.name.toUpperCase());

    // 3. Find missing ones
    const newDepts = studentDepts.filter(d => d && !existingNames.includes(d.toUpperCase()));

    // 4. Create missing departments
    let createdCount = 0;
    for (const deptName of newDepts) {
        await Department.create({
            name: deptName,
            collegeId: collegeId,
            head: 'Unassigned', // Default
            facultyCount: 0
        });
        createdCount++;
    }

    res.json({ message: `Synced departments. Created ${createdCount} new departments.`, new: newDepts });
};

module.exports = { getDepartments, addDepartment, syncDepartments };
