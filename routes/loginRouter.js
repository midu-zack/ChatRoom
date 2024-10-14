const express = require("express");
const { loginUser, submit, deleteUser, updateSettings, getUserById, updateUserName } = require("../controllers/Login");


 
const router = express.Router()

router.get('/',loginUser)
router.post('/join',submit)
router.post('/delete/:userId',deleteUser)
router.get('/get-user/:id', getUserById);
 
router.post('/users/:id/update-username', updateUserName);

module.exports = router;