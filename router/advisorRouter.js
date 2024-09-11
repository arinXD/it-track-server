const express = require('express');
const isAdmin = require('../middleware/adminMiddleware');
const router = express.Router();
const advisorController = require('../controller/advisorController');

router.get("/", isAdmin, advisorController.getAllTeachers)
router.get("/:email", isAdmin, advisorController.getTeacherByEmail)
router.get("/students/:id", isAdmin, advisorController.hasAdvisor)

router.post("/students/spread-sheet", isAdmin, advisorController.createStudentAdvisorSpreadSheet)
router.post("/:aid/students/:sid", isAdmin, advisorController.createStudentAdvisor)

router.delete("/students/multiple", isAdmin, advisorController.deleteFromAdvisor)

module.exports = router