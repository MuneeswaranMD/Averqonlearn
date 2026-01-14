const express = require('express');
const router = express.Router();
const { getDepartments, addDepartment } = require('../controllers/departmentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getDepartments)
    .post(protect, admin, addDepartment);

module.exports = router;
