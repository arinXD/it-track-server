var express = require('express');
var router = express.Router();
const models = require('../models');
const Student = models.Student

router.get("/", async (req, res) => {
    const students = await Student.findAll()
    return res.status(200).json({
        ok: true,
        data: students
    })
})

module.exports = router