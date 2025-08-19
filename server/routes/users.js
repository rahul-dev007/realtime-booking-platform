// server/routes/users.js (নতুন ফাইল)

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');

// @route   GET api/users/profile
// @desc    Get current user's profile
// @access  Private
router.get('/profile', authMiddleware, getUserProfile);

// @route   PUT api/users/profile
// @desc    Update user's profile
// @access  Private
router.put('/profile', authMiddleware, updateUserProfile);

module.exports = router;