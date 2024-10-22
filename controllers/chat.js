const Message = require('../models/Message');
// Fetch chat messages between two users
const getChatMessages = async (req, res) => {
    const { userId, recipientId } = req.params;

    console.log('Received request parameters:', req.params); // Check if parameters are being received

    try {
        // Fetch messages from the database
        const messages = await Message.find({
            $or: [
                { senderId: userId, recipientId: recipientId },
                { senderId: recipientId, recipientId: userId }
            ]
        }).sort({ createdAt: 1 }); // Sort messages by creation time



        console.log('This is messages', messages);

        return res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Save a new message
const sendMessage = async (data) => {

    console.log('helloo zackeyy how are you', data);

    try {
        console.log('This is messages', data);

        const newMessage = new Message(data);



        await newMessage.save(); // Save the message to the database
        return newMessage;
    } catch (error) {
        console.error("Error saving message:", error);
        throw new Error("Error saving message");
    }
};

module.exports = {
    getChatMessages,
    sendMessage
};
