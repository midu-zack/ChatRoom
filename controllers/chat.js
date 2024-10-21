const Message = require('../models/Message');

// Render chat page and send previous messages
exports.getChatPage = async (req, res) => {
    const userId = req.session.userId; // Assuming session contains userId
    const recipientId = req.query.recipientId || 'recipient-id'; // Get recipientId from the query

    console.log("This is user id ", userId);
    console.log("This is recipientId",recipientId);
    
    

    try {
        // Fetch previous messages between the two users
        const messages = await Message.find({
            $or: [
                { senderId: userId, recipientId: recipientId },
                { senderId: recipientId, recipientId: userId }
            ]
        }).sort({ timestamp: 1 });

        res.render('chat', { userId, recipientId, messages });
    } catch (error) {
        res.status(500).send('Error loading chat page');
    }
};


exports.sendMessage = (socket, io) => {
    socket.on('message', async (messageData) => {
        try {
            // Log message details to the console
            console.log(`Sender: ${messageData.senderId}, Message: ${messageData.content}, Recipient: ${messageData.recipientId}`);

            // Save message to the database
            const newMessage = new Message({
                senderId: messageData.senderId,  // Ensure senderId is correct
                recipientId: messageData.recipientId,  // Ensure recipientId is correct
                content: messageData.content,
                timestamp: new Date()
            });
            await newMessage.save();

            // Emit the message to both the sender and recipient in real-time
            io.to(messageData.senderId).emit('messageSaved', newMessage);
            io.to(messageData.recipientId).emit('messageSaved', newMessage);
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });
};
