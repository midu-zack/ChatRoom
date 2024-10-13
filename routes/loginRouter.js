const express = require("express");
const { loginUser, submit, deleteUser, updateSettings } = require("../controllers/Login");


 
const router = express.Router()

router.get('/',loginUser)
router.post('/join',submit)
router.post('/delete/:userId',deleteUser)
router.post('/settings/:userId', updateSettings);

module.exports = router;