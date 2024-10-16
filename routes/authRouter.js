const express = require("express");
const { loginUser, submit, deleteUser, getUserById, updateUserName, openChat, allUsers, signup, login } = require("../controllers/auth");
const { signupValidation, loginValidation } = require('../middlewares/validators');

 
const router = express.Router()

router.get('/', (req, res) => {
    res.render('login'); // Render login page at root
  });
  

 
router.get('/signup', (req, res) => res.render('signup'));
router.post('/signup', signupValidation,signup);

// Login routes
router.get('/login', (req, res) => res.render('login'));
router.post('/login', loginValidation,login);

 



// router.get('/',loginUser)
// router.post('/join',submit)

// router.get('/api/exit-chat', allUsers);



// router.post('/delete/:userId',deleteUser)
// router.get('/get-user/:id', getUserById);
 
// router.post('/users/:id/update-username', updateUserName);

// router.get('/chat/:id',openChat)

module.exports = router;