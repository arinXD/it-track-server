const express = require('express');
const isOwner = require('../middleware/isOwnerMiddleware');
const { getResultInSelectionByStuId } = require('../controller/selectionController');
const router = express.Router();

router.get("/:stuid", getResultInSelectionByStuId)

module.exports = router