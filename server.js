const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Socket events
io.on('connection', socket => {
    socket.on('newuser', username => {
        socket.broadcast.emit('chat', {
            username: 'System',
            text: `${username} has joined the chat`,
            time: new Date().toLocaleTimeString()
        });
    });

    socket.on('chat', message => {
        io.emit('chat', message); // Broadcast to everyone
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
