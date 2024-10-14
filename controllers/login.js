const User = require('../models/User');

const loginUser = (req, res) => {
    try {
        res.render("login");  // Render the login page
    } catch (error) {
        console.error("Error rendering login page:", error);
        res.status(500).send("Internal Server Error");
    }
}

const allUsers =(req,res)=>{
    try {
        res.render("mainBody")
    } catch (error) {
        console.error("Error rendering login page:", error);
        res.status(500).send("Internal Server Error");
    }
}

const submit = async (req, res) => {
    try {
        const { name } = req.body; // Destructure to get name
       

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

        console.log('User saved name :', name);

        // Fetch all users from the database after saving new user
        const users = await User.find({});
       

        // Render chat page with current user and all users from the database
        return res.render('mainBody', { name, users });

    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).send('Internal Server Error');
    }
};


const deleteUser = (req, res) => {

    const userId = req.params.userId;

    console.log("this is userId",userId);
    
  
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
  


 
// Controller to fetch user details by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        console.log('this is choose the edit user ', user)
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Controller to update user name by ID
const updateUserName = async (req, res) => {
    const { username } = req.body;
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { name: username }, { new: true });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Route to render chat page
const openChat = async (req, res) => {
    try {
        // Fetch the user by ID
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Render the chat page and pass the user data
        res.render('chat', { user });
    } catch (error) {
        res.status(500).send('Server error');
    }
}





module.exports = {
    loginUser,
    submit,
    deleteUser,
    getUserById,
    updateUserName,
    openChat,
    allUsers

};
