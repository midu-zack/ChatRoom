const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');

// Handle real-time chat functionality
const getChatPage = async (req, res) => {
    const userId = req.session.userId;  // Assuming you store the logged-in user’s ID in the session
    const recipientId = req.query.recipientId;  // Passed when a user is selected

    if (!userId || !recipientId) {
        return res.status(400).send('Invalid request');
    }

    // Check if recipientId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
        return res.status(400).send("Invalid recipient ID");
    }

    const user = await User.findById(userId);
    const recipient = await User.findById(recipientId);

    if (!user || !recipient) {
        return res.status(404).send('User not found');
    }

    res.render('chat', { user, recipient });
};

// Save messages to the database
const sendMessage = async (req, res) => {
    const senderId = req.session.userId;

    if (!senderId) {
        return res.status(401).send('User not logged in');
    }

    const { recipientId, content } = req.body;

    // Validate if recipientId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
        return res.status(400).send("Invalid recipient ID");
    }

    const newMessage = new Message({
        sender: senderId,
        recipient: recipientId,
        content: content,
    });

    await newMessage.save();
    res.send('Message sent');
};

// Fetch chat messages between two users
const getMessages = async (req, res) => {
    const userId = req.session.userId;
    const recipientId = req.query.recipientId;

    if (!userId || !recipientId) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    // Validate if recipientId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
        return res.status(400).json({ error: 'Invalid recipient ID' });
    }

    const messages = await Message.find({
        $or: [
            { sender: userId, recipient: recipientId },
            { sender: recipientId, recipient: userId },
        ]
    }).sort('createdAt');

    res.status(200).json(messages);
};

// Fetch a single message by its ID
const getMessageById = async (req, res) => {
    const messageId = req.params.id;

    // Validate if the messageId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
        return res.status(400).send("Invalid message ID");
    }

    try {
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).send('Message not found');
        }

        res.json(message);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getChatPage,
    sendMessage,
    getMessages,
    getMessageById
};
