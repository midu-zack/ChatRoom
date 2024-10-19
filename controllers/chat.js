const Message = require('../models/Message');
const User = require('../models/User');

// Fetch chat messages between two users
const getMessages = async (req, res) => {
    const { senderId, recipientId } = req.params;

    try {
        // Find messages between the two users (both sender and recipient)
        const messages = await Message.find({
            $or: [
                { sender: senderId, recipient: recipientId },
                { sender: recipientId, recipient: senderId }
            ]
        }).sort({ createdAt: 1 }); // Sort by date (oldest first)

        // Render the chat page with the messages
        res.render('chat', { messages, senderId, recipientId });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Save a new message
const sendMessage = async (req, res) => {
    const { senderId, recipientId, content } = req.body;

    try {
        const newMessage = new Message({
            sender: senderId,
            recipient: recipientId,
            content
        });

        await newMessage.save();

        res.status(200).json({ success: true, message: newMessage });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, message: 'Failed to send message' });
    }
};

module.exports = {
    getMessages,
    sendMessage
};
