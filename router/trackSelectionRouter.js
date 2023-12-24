var express = require('express');
var router = express.Router();
const models = require('../models');
const TrackSelection = models.TrackSelection
const Subject = models.Subject

const trackSelectAttr = []
const subjectAttr = ["subject_code", "title_th", "title_en", "credit"]

router.get("/", async (req, res) => {
    try {
        const data = await TrackSelection.findAll({
            include: [
                {
                    model: Subject,
                    attributes: subjectAttr,
                },
            ],
            order: [
                ['acadyear', 'DESC'],
            ],
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
router.get("/:id", async (req, res) => {
    const id = req.params.id
    try {
        const data = await TrackSelection.findOne({
            where: {
                id
            },
            include: [
                {
                    model: Subject,
                    attributes: subjectAttr,
                },
            ],
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
router.get("/:id/subjects", async (req, res) => {
    const id = req.params.id
    try {
        const data = await TrackSelection.findOne({
            where: {
                id
            },
            include: [
                {
                    model: Subject,
                    attributes: subjectAttr,
                },
            ],
        })
        return res.status(200).json({
            ok: true,
            data: data.Subjects
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
router.get("/get/last", async (req, res) => {
    try {
        const data = await TrackSelection.findOne({
            include: [
                {
                    model: Subject,
                    attributes: subjectAttr,
                },
            ],
            order: [
                ['acadyear', 'DESC'],
            ],
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