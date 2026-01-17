const express = require('express');
const router = express.Router();
const { protect, admin, superAdmin } = require('../middleware/authMiddleware');
const {
    createExam,
    getExams,
    getExamById,
    submitExam,
    getStudentResults,
    getExamAnalytics,
    getTPOAnalytics,
    logViolation,
    executeCode,
    logAction
} = require('../controllers/examController');

router.post('/', protect, createExam);
router.post('/execute', protect, executeCode);
router.post('/log-action', protect, logAction);
router.get('/', protect, getExams);
router.get('/results', protect, getStudentResults);
router.get('/analytics/:examId', protect, getExamAnalytics);
router.get('/tpo-analytics', protect, getTPOAnalytics);
router.get('/:id', protect, getExamById);
router.post('/submit', protect, submitExam);
router.post('/log-violation', protect, logViolation);

module.exports = router;
