const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');

// Import models
const Message = require('./models/Message');  // Make sure the Message model is correctly imported

const authRouter = require('./routes/authRouter');
const connectionRouter = require('./routes/connectionsRouter');
const chatRouter = require("./routes/chatRouter");
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

const server = http.createServer(app);
const io = socketIo(server);

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, "views")));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.log('Failed to connect to MongoDB:', err));

app.use("/", authRouter);
app.use("/", connectionRouter);
app.use("/", chatRouter);

// Socket.io logic
io.on('connection', (socket) => {
    console.log('A user connected');

        // Listen for incoming messages
        socket.on('chat message', async (msgData) => {
            const { senderId, recipientId, content } = msgData;
        
            console.log('Received message data:', msgData); // Log entire message data
        
            try {
                // Validate ID formats
                console.log('Sender ID:', senderId);
                console.log('Recipient ID:', recipientId);
        
                if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(recipientId)) {
                    throw new Error('Invalid sender or recipient ID');
                }
        
                // Save message to the database
                const newMessage = new Message({
                    sender: senderId,
                    recipient: recipientId,
                    content: content,
                });
                await newMessage.save();
        
                // Emit the message to both users
                io.to(senderId).emit('chat message', newMessage);
                io.to(recipientId).emit('chat message', newMessage);
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });
        

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
