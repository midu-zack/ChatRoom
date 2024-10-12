const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Ensure that name is required
       
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
