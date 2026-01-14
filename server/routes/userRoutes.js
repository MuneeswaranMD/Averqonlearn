const express = require('express');
const router = express.Router();
const { getUsersByRole, addUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, admin, addUser);

router.route('/role/:role')
    .get(protect, getUsersByRole);

router.route('/:id')
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

module.exports = router;
