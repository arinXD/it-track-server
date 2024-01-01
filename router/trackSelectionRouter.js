var express = require('express');
var router = express.Router();
const models = require('../models');
const TrackSelection = models.TrackSelection
const TrackSubject = models.TrackSubject
const Subject = models.Subject
const adminMiddleware = require("../middleware/adminMiddleware")

const trackSelectAttr = []
const subjectAttr = ["subject_code", "title_th", "title_en", "credit"]

router.get("/", async (req, res) => {
    try {
        const data = await TrackSelection.findAll({
            include: [{
                model: Subject,
                attributes: subjectAttr,
            }, ],
            order: [
                ['acadyear', 'DESC'],
            ],
        })
        return res.status(200).json({
            ok: true,
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
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
            include: [{
                model: Subject,
                attributes: subjectAttr,
            }, ],
        })
        return res.status(200).json({
            ok: true,
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
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
            include: [{
                model: Subject,
                attributes: subjectAttr,
            }, ],
        })
        return res.status(200).json({
            ok: true,
            data: data.Subjects
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})
router.get("/get/last", async (req, res) => {
    try {
        const data = await TrackSelection.findOne({
            include: [{
                model: Subject,
                attributes: subjectAttr,
            }, ],
            order: [
                ['acadyear', 'DESC'],
            ],
        })
        return res.status(200).json({
            ok: true,
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

// create
router.post("/", adminMiddleware, async (req, res) => {
    const {
        acadyear,
        title,
        startAt,
        expiredAt,
        trackSubj,
    } = req.body

    try {
        const ts = await TrackSelection.findOne({
            where: {
                acadyear
            }
        })

        if (!ts) {
            const newTsData = {
                acadyear,
                title,
                startAt,
                expiredAt,
            }
            const newTs = await TrackSelection.create(newTsData)
            for (const subj of trackSubj) {
                await TrackSubject.create({
                    track_selection_id: newTs.id,
                    subject_code: subj
                })
            }
            return res.status(201).json({
                ok: true,
                message: `เพิ่มการคัดแทรคปีการศึกษา ${acadyear} เรียบร้อย`
            })
        } else {
            return res.status(401).json({
                ok: false,
                message: `การคัดแทรคปีการศึกษา ${acadyear} ถูกเพิ่มไปแล้ว`
            })
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

module.exports = router