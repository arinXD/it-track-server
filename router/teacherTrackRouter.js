var express = require('express');
var router = express.Router();
const models = require('../models');
const TeacherTrack = models.TeacherTrack

router.get("/", async (req, res) => {
    try {
        const data = await TeacherTrack.findAll()
        return res.status(200).json({
            ok: true,
            data
        })
    } catch (error) {
        return res.status(500).json({
            ok: true,
            message: "Server error."
        })
    }
})
router.get("/:track", async (req, res) => {
    const track = req.params.track
    try {
        const data = await TeacherTrack.findAll({
            where: {
                track
            }
        })
        return res.status(200).json({
            ok: true,
            data
        })
    } catch (error) {
        return res.status(500).json({
            ok: true,
            message: "Server error."
        })
    }
})

module.exports = router