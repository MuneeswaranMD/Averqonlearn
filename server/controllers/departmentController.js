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

module.exports = { getDepartments, addDepartment };
