const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/authMiddleware');
const adminMiddleware = require("../middleware/adminMiddleware");
const { 
    testSelection, getAllTrackSelections, getTrackSelections, getStudentInTrackSelection, 
    getDashboardData, getMostPopularTrack, getSubjectInTrackSelection, getLastest, getStudentAndSubject, 
    createTrackSelection, updateTrackSelection, selectTrack, deleteTraclSelect, multipleDelete,
    getStudentNonSelect,
    sendEmailToStudent,
} = require('../controller/trackSelectionController');

// test
router.get("/test/selection", adminMiddleware, testSelection)

// GET
router.get("/", adminMiddleware, getAllTrackSelections)
router.get("/:id", isAuth, getTrackSelections)
router.get("/:id/subjects", adminMiddleware, getSubjectInTrackSelection)
router.get("/get/last", adminMiddleware, getLastest)
router.get("/:acadyear/students", adminMiddleware, getStudentInTrackSelection)
router.get("/:acadyear/non-select", adminMiddleware, getStudentNonSelect)
router.get("/:acadyear/popular", adminMiddleware, getMostPopularTrack)
router.get("/:acadyear/students/dashboard", adminMiddleware , getDashboardData)
router.get("/:id/subjects/students", adminMiddleware, getStudentAndSubject)

// POST
router.post("/", adminMiddleware, createTrackSelection)
router.post("/:acadyear/email/send", adminMiddleware, sendEmailToStudent)

// PUT
router.put("/:id", adminMiddleware, updateTrackSelection)
router.put('/selected/:id', adminMiddleware, selectTrack) // เปิด, ปิด การคัดแทร็ก

// DELETE
router.delete("/:id", adminMiddleware, deleteTraclSelect)
router.delete('/del/selected', adminMiddleware, multipleDelete)

module.exports = router