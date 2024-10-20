const express = require('express');
const chatController = require('../controllers/chat');
const router = express.Router();

// Route to render the chat page
router.get('/chat', chatController.getChatPage);

module.exports = router;
