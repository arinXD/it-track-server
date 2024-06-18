const express = require('express');
const router = express.Router();
const isAuth = require("../middleware/authMiddleware")
const isAdmin = require("../middleware/adminMiddleware");
const { careerCreateUploader, careerUpdateUploader } = require('../utils/uploader');
const { createCareer, getAllCareers, updateCareer, deleteMultipleCareer, getCareerByTrack } = require('../controller/careerController');

// GET
router.get("/", getAllCareers)
router.get("/:track", getCareerByTrack)

// POST
router.post("/", careerCreateUploader.single("image"), createCareer)

// PUT
router.put("/:id", careerUpdateUploader.single("image"), updateCareer)

// DELETE
router.delete("/multiple", deleteMultipleCareer)

module.exports = router