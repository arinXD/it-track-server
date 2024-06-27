const express = require('express');
const isAdmin = require('../middleware/adminMiddleware');
const {
     getAllAssessments, createAssessment, getAssessmentsInForm, getAssessmentsNotInForm
} = require('../controller/assessmentController');
const router = express.Router();

// GET
router.get("/", isAdmin, getAllAssessments)
router.get("/in-form/:id", isAdmin, getAssessmentsInForm)
router.get("/not-in-form/:id", isAdmin, getAssessmentsNotInForm)

// POST
router.post("/", isAdmin, createAssessment)

module.exports = router