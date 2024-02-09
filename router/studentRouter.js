var express = require('express');
var router = express.Router();
const models = require('../models');
const Student = models.Student
const Selection = models.Selection
const SelectionDetail = models.SelectionDetail

router.get("/", async (req, res) => {
    try {
        const students = await Student.findAll()
        return res.status(200).json({
            ok: true,
            data: students
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

router.get("/:id/track/select/", async (req, res) => {
    const stu_id = req.params.id
    try {
        const select = await Selection.findOne({
            where: {
                stu_id
            },
        })
        return res.status(200).json({
            ok: true,
            data: select
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

router.get("/:id/track/select/detail", async (req, res) => {
    const stu_id = req.params.id
    try {
        const select = await Selection.findOne({
            where: {
                stu_id
            },
            include: [{
                model: SelectionDetail,
            }, ],
        })
        const selectionDetailId = []
        if (select) {
            const subjects = select.SelectionDetails
            for (const subject of subjects) {
                selectionDetailId.push(subject.dataValues.id)
            }
        }
        return res.status(200).json({
            ok: true,
            data: select
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})
router.post("/track/select", async (req, res) => {
    const {
        track_selection_id,
        stu_id,
        track_order_1,
        track_order_2,
        track_order_3,
        subjectsData
    } = req.body

    let selectData = {
        track_selection_id,
        stu_id,
        track_order_1,
        track_order_2,
        track_order_3,
    }
    const selectionDetailId = []
    try {
        let selectId = await Selection.findOne({
            where: {
                stu_id
            },
            include: [{
                model: SelectionDetail,
            }, ],
        })
        if (selectId) {
            selectData.id = selectId.id
            const subjects = selectId.SelectionDetails
            for (const subject of subjects) {
                selectionDetailId.push(subject.dataValues.id)
            }
        }
        let userSelection = await Selection.upsert(selectData)
        for (const index in subjectsData) {
            let selectDetail = subjectsData[index]
            if (selectId) {
                selectDetail.id = selectionDetailId[index]
                selectDetail.selection_id = selectId.id
            } else {
                selectDetail.selection_id = userSelection[0].dataValues.id
            }
            await SelectionDetail.upsert(selectDetail)
        }
        let resultData
        if (selectId) {
            resultData = selectId
        } else {
            resultData = userSelection[0].dataValues
        }
        console.log(resultData.dataValues.updatedAt);
        return res.status(201).json({
            ok: true,
            data: resultData,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

module.exports = router