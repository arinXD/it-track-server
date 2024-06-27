const express = require('express');
const isAdmin = require('../middleware/adminMiddleware');
const { getAllAssessments, createAssessment } = require('../controller/assessmentController');
const router = express.Router();

// GET
router.get("/", isAdmin, getAllAssessments)

// POST
router.post("/", isAdmin, createAssessment)

module.exports = router