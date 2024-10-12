const User = require('../models/User');

const loginUser = (req, res) => {
    try {
        res.render("login");  // Render the login page
    } catch (error) {
        console.error("Error rendering login page:", error);
        res.status(500).send("Internal Server Error");
    }
}
const submit = async (req, res) => {
    try {
        const name = req.body.name;
        console.log('This is user name:', name); // Log the received name

        if (!name) {
            return res.status(400).send('Username is required');
        }

        // Check for duplicates
        const existingUser = await User.findOne({ name });
        // if (existingUser) {
        //     return res.status(409).send('Username already taken');
        // }

        // Create a new user
        const newUser = new User({ name });
        await newUser.save();

        console.log('User saved:', name);

        // Fetch all users from the database
        const users = await User.find({});

        // Render chat page with current user and all users from the database
        return res.render('mainBody', { name, users });

    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).send('Internal Server Error');
    }
};


module.exports = {
    loginUser,
    submit
};
