const express = require('express');
const router = express.Router();
const { authUser, registerUser, getMe, updateSettings } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', authUser);
router.post('/register', registerUser);
router.get('/me', protect, getMe);
router.put('/settings', protect, updateSettings);

module.exports = router;
