const express = require("express");
const { loginUser, submit } = require("../controllers/Login");


 
const router = express.Router()

router.get('/',loginUser)
router.post('/join',submit)

module.exports = router;