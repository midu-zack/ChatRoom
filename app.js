const express = require('express');
const http = require('http'); // Import the HTTP module
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');

const loginRouter = require('./routes/loginRouter');
const bodyParser = require('body-parser');
 
const app = express();
const PORT = 4000;

// Create the HTTP server with Express
const server = http.createServer(app);

// Initialize Socket.io with the server
const io = socketIo(server);

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connecting template 
app.set('view engine', 'hbs');

// Connect the views 
app.use(express.static(path.join(__dirname, "views")));

// Connect to MongoDB Atlas using the environment variable
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.log('Failed to connect to MongoDB:', err));

// Socket.io logic
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for incoming messages
    socket.on('chat message', (msg) => {
        console.log('Message received: ', msg);

        // Broadcast the message to all connected users
        io.emit('chat message', msg);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Use login router
app.use("/", loginRouter);
 

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
