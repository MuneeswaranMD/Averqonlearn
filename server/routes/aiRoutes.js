const express = require('express');
const router = express.Router();
const { askAI, generateQuiz } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/ai/ask
router.post('/ask', protect, askAI);
router.post('/generate-quiz', protect, generateQuiz);

module.exports = router;
