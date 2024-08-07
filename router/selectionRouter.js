const express = require('express');
const isOwner = require('../middleware/isOwnerMiddleware');
const { getResultInSelectionByStuId, getResultInSelectionById,
     updateSelection, createSelection,
     deleteSelection} = require('../controller/selectionController');
const router = express.Router();

router.get("/stu-id/:stuid", getResultInSelectionByStuId)
router.get("/id/:id", getResultInSelectionById)

router.post("/", createSelection)

router.put("/:id", updateSelection)

router.delete("/multiple", deleteSelection)

module.exports = router