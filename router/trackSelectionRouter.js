var express = require('express');
var router = express.Router();
const models = require('../models');
const TrackSelection = models.TrackSelection
const Subject = models.Subject

router.get("/", async (req, res) => {
    try {
        const data = await TrackSelection.findAll({
            include: [
                {
                    model: Subject,
                },
            ]
        })
        return res.status(200).json({
            ok: true,
            data
        })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: true,
            message: "Server error."
        })
    }
})

module.exports = router