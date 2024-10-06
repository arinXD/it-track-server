const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/adminMiddleware');
const isAuth = require('../middleware/authMiddleware');
const { getAllQuestion, createQuestion, getQuestionsNotInForm,
     getQuestionsInForm, 
     deleteQuestion} = require('../controller/questionBankController');

// GET
router.get("/", isAuth, getAllQuestion)
router.get("/in-form/:id", isAdmin, getQuestionsInForm)
router.get("/not-in-form/:id", isAdmin, getQuestionsNotInForm)

// POST
router.post("/", isAdmin, createQuestion)

// DELETE
router.delete("/:id", isAdmin, deleteQuestion)


module.exports = router
