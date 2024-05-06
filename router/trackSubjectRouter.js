const express = require('express');
const router = express.Router();
const models = require('../models');
const { findSubjectByCode } = require('../utils/subject');
const { Op } = require('sequelize');
const TrackSubject = models.TrackSubject

router.post("/:id", async (req, res) => {
    const track_selection_id = req.params.id
    const subjects = req.body
    try {
        for (const subject_id of subjects) {
            if(!subject_id) continue
            const findSubject = await TrackSubject.findOne({
                where:{
                    track_selection_id,
                    subject_id,
                }
            }) 

            if(findSubject?.id) continue

            await TrackSubject.create({
                track_selection_id,
                subject_id
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: true,
            message: "เพิ่มวิชาไม่สำเร็จ"
        })
    }
    return res.status(201).json({
        ok: true,
        message: "เพิ่มวิชาสำเร็จ"
    })
})

router.delete("/:id", async (req, res) => {
    const track_selection_id = req.params.id
    const subjects = req.body
    try {
        for (const subject of subjects) {
            const subject_id = await findSubjectByCode(subject)
            await TrackSubject.destroy({
                where: {
                    [Op.and]: [{
                            track_selection_id
                        },
                        {
                            subject_id
                        },
                    ]
                },
                force: true
            })
        }
    } catch (error) {
        return res.status(201).json({
            ok: true,
            message: "ลบวิชาไม่สำเร็จ"
        })
    }
    return res.status(201).json({
        ok: true,
        message: "ลบวิชาสำเร็จ"
    })
})

module.exports = router