const express = require('express');
const router = express.Router();
const isAuth = require("../middleware/authMiddleware")
const isAdmin = require("../middleware/adminMiddleware");
const { careerCreateUploader, careerUpdateUploader } = require('../utils/uploader');
const { createCareer, getAllCareers, updateCareer, deleteMultipleCareer, getCareerByTrack,
     getCareerByID, getCareerInSuggestForm, getCareerNotInForm
} = require('../controller/careerController');

// GET
router.get("/", isAuth, getAllCareers)
router.get("/:id", isAdmin, getCareerByID)
router.get("/tracks/:track", isAuth, getCareerByTrack)
router.get("/in-forms/:id", isAdmin, getCareerInSuggestForm)
router.get("/not-in-forms/:id", isAdmin, getCareerNotInForm)

// POST
router.post("/", isAdmin, careerCreateUploader.single("image"), createCareer)

// PUT
router.put("/:id", isAdmin, careerUpdateUploader.single("image"), updateCareer)

// DELETE
router.delete("/multiple", isAdmin, deleteMultipleCareer)

module.exports = router