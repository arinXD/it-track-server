var express = require('express');
var router = express.Router();
const models = require('../models');
const Track = models.Track
const Student = models.Student
const User = models.User
const Selection = models.Selection
const SelectionDetail = models.SelectionDetail

router.get("/", async (req, res) => {
    try {
        const data = await Track.findAll()
        return res.status(200).json({
            ok: true,
            data
        })
    }
    catch (error) {
        return res.status(500).json({
            ok: true,
            message: "Server error."
        })
    }
})

module.exports = router