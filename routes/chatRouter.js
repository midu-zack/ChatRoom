const express = require('express');
const { getMessages, sendMessage } = require('../controllers/chat');
const router = express.Router();

// Route to get messages between two users
router.get('/chat/:senderId/:recipientId', getMessages);

// Route to send a new message
router.post('/chat/send', sendMessage);

module.exports = router;
