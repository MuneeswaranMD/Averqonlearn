const express = require('express');
const router = express.Router();
const { getColleges, registerCollege, updateCollege, deleteCollege } = require('../controllers/collegeController');
const { protect, superAdmin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, superAdmin, getColleges)
    .post(protect, superAdmin, registerCollege);

router.route('/:id')
    .put(protect, superAdmin, updateCollege)
    .delete(protect, superAdmin, deleteCollege);

module.exports = router;
