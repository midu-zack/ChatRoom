const express = require("express");
const { loginUser } = require("../controllers/Login");


 
const router = express.Router()

router.get('/',loginUser)

module.exports = router;