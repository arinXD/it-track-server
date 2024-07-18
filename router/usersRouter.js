const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/authMiddleware');
const { getUserData } = require('../controller/userController');

router.get('/:email', getUserData)


module.exports = router