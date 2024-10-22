const express = require('express');
const chatController = require('../controllers/chat');

const router = express.Router();

// Route to fetch chat messages between two users
router.get('/:userId/:recipientId', chatController.getChatMessages);

module.exports = router;
