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
        const { name } = req.body; // Destructure to get name
        console.log('This is user name:', name); // Log the received name

        if (!name) {
            return res.status(400).send('Username is required');
        }

        // Check for duplicates
        const existingUser = await User.findOne({ name });
        if (existingUser) {
            // Fetch all users from the database if username is taken
            const users = await User.find({});
            return res.render('mainBody', { name, users });
        }

        // Create a new user if not a duplicate
        const newUser = new User({ name });
        await newUser.save();

        console.log('User saved:', name);

        // Fetch all users from the database after saving new user
        const users = await User.find({});
        console.log("All users:", users);

        // Render chat page with current user and all users from the database
        return res.render('mainBody', { name, users });

    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).send('Internal Server Error');
    }
};


const deleteUser = (req, res) => {
    const userId = req.params.userId;
  
    User.findByIdAndDelete(userId)
      .then(() => {
        // Redirect to the users page after deletion
        res.status(200).json({ success: true, message: 'User deleted successfully' });
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Error deleting user' });
      });
  };
  


// Function to update user settings

const updateSettings = async (req, res) => {
    try {
        const { userId, username, icon } = req.body;

        // Check if the user ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        // Find and update the user
        const updatedUser = await User.findByIdAndUpdate(userId, { name: username, icon }, { new: true });

        // If the user was not found
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Send the updated user details
        return res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Error updating user settings:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
 



module.exports = {
    loginUser,
    submit,
    deleteUser,
    updateSettings,
};
