const express = require('express')
const path = require('path');
const { loginUser } = require('./controllers/Login');
const app = express()
const PORT = 4000 ;

// connecting template 
app.set('view engine','hbs')
// connect the views 
app.use(express.static(path.join(__dirname,"views")))

 app.use("/",loginUser)

app.listen(PORT,()=>{
    console.log(`sever running for ${PORT}`)
})



// const express = require('express');
// const http = require('http');
// const socketio = require('socket.io');
// const path = require('path');

// const app = express();
// const server = http.createServer(app);
// const io = socketio(server);
// const PORT = 3000;
// // Serve static files
// app.use(express.static(path.join(__dirname,'public')));

// // Routes
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// app.get('/chat', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'chat.html'));
// });

// // Socket events
// io.on('connection', socket => { 
//     socket.on('newuser', username => {
//         socket.broadcast.emit('chat', {
//             username: 'System',
//             text: `${username} has joined the chat`,
//             time: new Date().toLocaleTimeString()
//         });
//     });

//     socket.on('chat', message => {
//         io.emit('chat', message); // Broadcast to everyone
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected');
//     });
// });

// // Start server

// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



