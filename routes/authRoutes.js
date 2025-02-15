const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { sendMessage, getMessages } = require('../controllers/messageController');
const authenticateJWT = require('../middlewares/authMiddleware');

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Profile route (secured by JWT)
router.get('/profile', authenticateJWT, getUserProfile);

// Send message (secured by JWT)
router.post('/send-message', authenticateJWT, sendMessage);

// Get messages (secured by JWT)
router.get('/messages', authenticateJWT, getMessages);

module.exports = router;
