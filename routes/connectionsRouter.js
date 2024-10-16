const express = require("express");

const {  connections, search, person } = require("../controllers/connection");

const router = express.Router()

router.get("/connection",connections)
router.get('/search-users',search )
router.get('/chat/:id',person)

module.exports = router;