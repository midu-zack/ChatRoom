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
    const { id } = req.params;

    try {
        // Find the user by ID
        const user = await User.findById(id).select('name email'); // You can select other fields if needed

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Render chat.hbs and pass user data to the view
        res.render('chat', { user });
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