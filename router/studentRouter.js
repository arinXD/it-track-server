var express = require('express');
var router = express.Router();
const models = require('../models');
const { getThaiDateTime } = require('../lib/date');
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

    let insertData = {
        track_selection_id,
        stu_id,
        track_order_1,
        track_order_2,
        track_order_3,
    }
    const selectionDetailId = []
    try {
        let findSelection = await Selection.findOne({
            where: {
                stu_id
            },
            include: [{
                model: SelectionDetail,
            }, ],
        })
        if (findSelection) {
            // add id to selection for update
            insertData.id = findSelection.id

            const subjects = findSelection.SelectionDetails
            for (const subject of subjects) {
                selectionDetailId.push(subject.dataValues.id)
            }
        }
        let userSelection = await Selection.upsert(insertData)
        for (const index in subjectsData) {
            let selectDetail = subjectsData[index]
            if (findSelection) {
                selectDetail.id = selectionDetailId[index]
                selectDetail.selection_id = findSelection.id
            } else {
                selectDetail.selection_id = userSelection[0].dataValues.id
            }
            await SelectionDetail.upsert(selectDetail)
        }
        let resultData
        if (findSelection) {
            resultData = findSelection
        } else {
            resultData = userSelection[0].dataValues
            resultData.updatedAt = getThaiDateTime()
        }
        console.log(resultData?.updatedAt);
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