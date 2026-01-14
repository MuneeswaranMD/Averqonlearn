const express = require('express');
const router = express.Router();
const { 
    getSubjects, addSubject, deleteSubject,
    getContent, addContent, deleteContent 
} = require('../controllers/academicController');
const { seedData } = require('../controllers/seedController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/seed', seedData); // Open for now to allow one-click demo setup

router.get('/subjects', protect, getSubjects);
router.post('/subjects', protect, admin, addSubject);
router.delete('/subjects/:id', protect, admin, deleteSubject);

router.get('/content', protect, getContent);
router.post('/content', protect, admin, addContent);
router.delete('/content/:id', protect, admin, deleteContent);

module.exports = router;
