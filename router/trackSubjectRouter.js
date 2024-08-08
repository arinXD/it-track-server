const express = require('express');
const { createSubjectInTrack, deleteSubjectInTrack } = require('../controller/trackSubjectController');
const router = express.Router();

router.post("/:id", createSubjectInTrack)
router.delete("/:id", deleteSubjectInTrack)

module.exports = router