const express = require('express');
const router = express.Router();
const { 
    getSubjects, addSubject, deleteSubject, updateSubject,
    getContent, addContent, deleteContent, updateContent
} = require('../controllers/academicController');
const { seedData } = require('../controllers/seedController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/seed', seedData); // Open for now to allow one-click demo setup

router.get('/subjects', protect, getSubjects);
// Allow Faculty + Admins to create subjects
router.post('/subjects', protect, (req, res, next) => {
    if (req.user && (req.user.role === 'faculty' || req.user.role === 'collegeAdmin' || req.user.role === 'superAdmin')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as faculty or admin' });
    }
}, addSubject);
router.delete('/subjects/:id', protect, (req, res, next) => {
    if (req.user && (req.user.role === 'faculty' || req.user.role === 'collegeAdmin' || req.user.role === 'superAdmin')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized' });
    }
}, deleteSubject);

// Update routes with same permissions
router.put('/subjects/:id', protect, (req, res, next) => {
    if (req.user && (req.user.role === 'faculty' || req.user.role === 'collegeAdmin' || req.user.role === 'superAdmin')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized' });
    }
}, updateSubject);

router.get('/content', protect, getContent);
// Allow Faculty + Admins to add Content
router.post('/content', protect, (req, res, next) => {
    if (req.user && (req.user.role === 'faculty' || req.user.role === 'collegeAdmin' || req.user.role === 'superAdmin')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized' });
    }
}, addContent);
router.put('/content/:id', protect, (req, res, next) => {
    if (req.user && (req.user.role === 'faculty' || req.user.role === 'collegeAdmin' || req.user.role === 'superAdmin')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized' });
    }
}, updateContent);
// Allow Faculty to delete their own content is handled in controller usually, or just protect here
router.delete('/content/:id', protect, (req, res, next) => { 
     if (req.user && (req.user.role === 'faculty' || req.user.role === 'collegeAdmin' || req.user.role === 'superAdmin')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized' });
    }
}, deleteContent);

module.exports = router;
