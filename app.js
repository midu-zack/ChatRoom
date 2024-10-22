const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');

// Import models
 
const authRouter = require('./routes/authRouter');
const connectionRouter = require('./routes/connectionsRouter');
const chatRouter = require("./routes/chatRouter");
const bodyParser = require('body-parser');

const { getChatMessages, sendMessage } = require('./controllers/chat'); // Import sendMessage correctly

const app = express();
const PORT = 4000;

const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

app.use('/api/chat', chatRouter);



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


// Your route to fetch messages
app.get('/api/chat/:userId/:recipientId', getChatMessages);

// Handle socket connections
io.on('connection', (socket) => {
    console.log('New client connected');

    // Listen for the sendMessage event
    socket.on('sendMessage', async (data) => {
        try {
            // Call sendMessage to save the message
            const savedMessage = await sendMessage(data);
            
            // Emit the saved message to the recipient
            socket.to(data.recipientId).emit('receiveMessage', {
                senderId: savedMessage.senderId,
                content: savedMessage.content,
                createdAt: savedMessage.createdAt // You might want to send this too
            });
        } catch (error) {
            console.error("Error in sendMessage socket event:", error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
