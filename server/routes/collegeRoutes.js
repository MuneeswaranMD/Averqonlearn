const express = require('express');
const router = express.Router();
const { getColleges, registerCollege, updateCollege, deleteCollege, updateMyCollege, getMyCollege } = require('../controllers/collegeController');
const { protect, superAdmin, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, superAdmin, getColleges)
    .post(protect, superAdmin, registerCollege);

router.route('/me')
    .get(protect, admin, getMyCollege)
    .put(protect, admin, updateMyCollege);

router.route('/:id')
    .put(protect, superAdmin, updateCollege)
    .delete(protect, superAdmin, deleteCollege);

module.exports = router;
