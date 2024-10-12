const express = require('express')
const path = require('path');
const bodyparser = require('body-parser')
require('dotenv').config()
const mongoose =require('mongoose')
 
const loginRouter = require('./routes/loginRouter')
const app = express()
const PORT = 4000 ;

//  Middleware to parse form data
app.use(express.urlencoded({ extended: true }));



// connecting template 
app.set('view engine','hbs')
// connect the views 
app.use(express.static(path.join(__dirname,"views")))


// Connect to MongoDB Atlas using the environment variable
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.log('Failed to connect to MongoDB:', err));




 app.use("/",loginRouter)

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



