const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/adminMiddleware');
const isAuth = require('../middleware/authMiddleware');
const { getForms, createForm, getAvailableForm, deleteMultiple,
     forceDeleteMultiple, getDeletedForms, availableForm,
     updateForm,
     getFormByID,
     insertQuestionsToForm,
     insertAssessmentsToForm
} = require('../controller/suggesFormController');

// GET
router.get("/", isAdmin, getForms)
router.get("/available", isAuth, getAvailableForm)
router.get("/deleted", isAuth, getDeletedForms)
router.get("/get-form/:id", isAdmin, getFormByID)

// POST
router.post("/", isAdmin, createForm)
router.post("/questions/:id", isAdmin, insertQuestionsToForm)
router.post("/assessments/:id", isAdmin, insertAssessmentsToForm)

// PUT
router.put("/:id", isAdmin, updateForm)
router.put("/:id/available", isAdmin, availableForm)

// DELETE
router.delete("/multiple", isAdmin, deleteMultiple)
router.delete("/multiple/force", isAdmin, forceDeleteMultiple)


module.exports = router