const express = require('express');
const http = require('http'); // Import the HTTP module
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');

const authRouter = require('./routes/authRouter');
const connectionRouter = require('./routes/connectionsRouter')
const chatRouter = require("./routes/chatRouter")
const bodyParser = require('body-parser');

 
const app = express();
const PORT = 4000;

 
const server = http.createServer(app);
 
const io = socketIo(server);


 
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(session({
    secret: 'your_secret_key', // Replace with a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set 'secure' to true if using HTTPS
  }));
  

 
app.set('view engine', 'hbs');

 
app.use(express.static(path.join(__dirname, "views")));

 
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.log('Failed to connect to MongoDB:', err));


     
app.use("/", authRouter);
app.use("/",connectionRouter)
app.use("/",chatRouter)
 





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


// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
