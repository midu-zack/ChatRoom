const express = require('express');
const { getMessages, sendMessage, getChatPage, getMessageById } = require('../controllers/chat');
const router = express.Router();

// Routes for chat
router.get('/chat', getChatPage);  // Renders the chat.hbs page
router.post('/chat/send-message', sendMessage);  // Handles sending messages
router.get('/chat/messages',getMessages);  // Fetch chat messages
router.get('/message/:id', getMessageById);

module.exports = router;
