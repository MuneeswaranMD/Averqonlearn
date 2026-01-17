const express = require('express');
const router = express.Router();
const { getDepartments, addDepartment, syncDepartments } = require('../controllers/departmentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getDepartments)
    .post(protect, admin, addDepartment);

router.post('/sync', protect, admin, syncDepartments);

module.exports = router;
