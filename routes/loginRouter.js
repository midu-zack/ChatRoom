const express = require("express");
const { loginUser, submit, deleteUser, getUserById, updateUserName, openChat, allUsers } = require("../controllers/Login");


 
const router = express.Router()

router.get('/',loginUser)
router.post('/join',submit)

router.get('/api/exit-chat', allUsers);



router.post('/delete/:userId',deleteUser)
router.get('/get-user/:id', getUserById);
 
router.post('/users/:id/update-username', updateUserName);

router.get('/chat/:id',openChat)

module.exports = router;