const express = require('express');
const router = express.Router();
const { 
    updateVideoProgress, 
    getStudentCourses, 
    getExamHistory, 
    getPerformanceAnalysis 
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

// Student Routes
router.post('/video-progress', protect, updateVideoProgress);
router.get('/my-courses', protect, getStudentCourses);
router.get('/my-history', protect, getExamHistory);
router.get('/my-analysis', protect, getPerformanceAnalysis);

// Faculty/Admin Routes (Accessing other student's data)
router.get('/student-history/:studentId', protect, getExamHistory);
router.get('/student-analysis/:studentId', protect, getPerformanceAnalysis);

module.exports = router;
