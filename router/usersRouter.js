const express = require('express');
const router = express.Router();
const { getUserData, getAllUsers, updateUserRole } = require('../controller/userController');
const isOwner = require('../middleware/isOwnerMiddleware');
const isAdmin = require('../middleware/adminMiddleware');

router.get('/', isAdmin, getAllUsers)
router.get('/:email', isOwner, getUserData)

router.patch('/:id/role/:role', isAdmin, updateUserRole)


module.exports = router