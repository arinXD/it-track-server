const express = require('express');
const isAdmin = require('../middleware/adminMiddleware');
const router = express.Router();
const teacherController = require('../controller/teacherController');

router.get("/", isAdmin, teacherController.getAllTeachers)
router.get("/:id", isAdmin, teacherController.getAllTeacherByID)
router.post("/", isAdmin, teacherController.createTeacher)
router.put("/:id", isAdmin, teacherController.updateTeacher)
router.delete("/:id", isAdmin, teacherController.deleteTeacher)

module.exports = router