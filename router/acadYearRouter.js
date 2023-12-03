var express = require('express');
var router = express.Router();
const models = require('../models');
const Acadyears = models.Acadyears

router.get("/", async (req, res) => {
    const students = await Acadyears.findAll()
    return res.status(200).json({
        ok: true,
        data: students
    })
})

module.exports = router