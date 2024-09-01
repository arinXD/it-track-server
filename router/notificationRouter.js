const express = require('express');
const isAuth = require('../middleware/authMiddleware');
const { getNotificationByEmail, readNotification } = require('../controller/notificationController');
const router = express.Router();

router.get("/:email", isAuth, getNotificationByEmail)

router.patch("/:id", isAuth, readNotification)

module.exports = router