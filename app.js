const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');

// Import models
const Message = require('./models/Message');  // Make sure the Message model is correctly imported
const chatController = require('./controllers/chat');
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


// When a client connects to the server
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Retrieve userId from the handshake query
    const userId = socket.handshake.query.userId;
    socket.join(userId); // Join a room with userId

    // Handle message event
    chatController.sendMessage(socket, io);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
