const express = require('express');
const isAdmin = require('../middleware/adminMiddleware');
const router = express.Router();
const advisorController = require('../controller/advisorController');

router.get("/", isAdmin, advisorController.getAllTeachers)
router.get("/students/:id", isAdmin, advisorController.hasAdvisor)

router.post("/:aid/students/:sid", isAdmin, advisorController.createStudentAdvisor)

module.exports = router