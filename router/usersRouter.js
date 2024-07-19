const express = require('express');
const router = express.Router();
const isOwner = require('../middleware/isOwnerMiddleware');
const { getUserData } = require('../controller/userController');

router.get('/:email', isOwner, getUserData)


module.exports = router