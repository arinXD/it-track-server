var express = require('express');
var router = express.Router();
const models = require('../models');
const Subject = models.Subject

router.get("/", async (req, res) => {
    const subjects = await Subject.findAll()
    return res.status(200).json({
        ok: true,
        data: subjects
    })
})

module.exports = router