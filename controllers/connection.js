const User = require('../models/User')

const connections = async (req, res) => {
    try {
        res.render('connections');
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
}


const search = async (req, res) => {
    const { name } = req.query;

    try {
        // Find users whose names start with the search query (case-insensitive)
        const users = await User.find({ name: new RegExp('^' + name, 'i') }).select('name'); // Only select name field
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};


const person = async (req, res) => {
    const { id: recipientId } = req.params;

    try {
        // Find the recipient user by their ID
        const recipient = await User.findById(recipientId).select('name email'); // Select additional fields if needed

 

        if (!recipient) {
            return res.status(404).send('User not found');
        }

      
        const userId = req.session.userId;  // Adjust if using JWT or other auth mechanisms


        // Render the chat.hbs and pass both userId and recipientId
        res.render('chat', {
            userId,        // Pass the current user's ID
            recipientId,   // Pass the recipient's ID
            recipientName: recipient.name,  // Pass the recipient's name (for display purposes)
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};



module.exports = {
    connections,
    search,
    person
}