var express = require('express');
var router = express.Router();
const models = require('../models');
const Student = models.Student
const Selection = models.Selection
const SelectionDetail = models.SelectionDetail
const Program = models.Program
const User = models.User
const StudentStatus = models.StudentStatus
const Enrollment = models.Enrollment
const Subject = models.Subject
const Track = models.Track
const adminMiddleware = require("../middleware/adminMiddleware");
const {
    Op
} = require('sequelize');

router.get("/:stuid", async (req, res) => {
    const stuid = req.params.stuid
    try {
        const students = await Student.findOne({
            where: {
                stu_id: stuid
            },
            include: [{
                    model: Program,
                },
                {
                    model: User,
                },
                {
                    model: StudentStatus,
                },
                {
                    model: Enrollment,
                    include: [{
                        model: Subject,
                    }, ]
                },
            ],
        })
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

router.get("/:id/track/select", async (req, res) => {
    const stu_id = req.params.id
    try {
        const select = await Selection.findOne({
            where: {
                stu_id
            },
            include: [{
                model: Track,
            }, ],
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
            resultData = selectId.dataValues
        } else {
            resultData = userSelection[0].dataValues
        }
        resultData.createdAt = thaiDate()
        resultData.updatedAt = thaiDate()
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

function thaiDate() {
    const currentDateUTC = new Date();
    const thailandOffset = 7 * 60 * 60 * 1000;

    const currentDateThailand = new Date(currentDateUTC.getTime() + thailandOffset);
    return currentDateThailand
}

// ----------------------------------
// Admin 
// ----------------------------------

router.get("/", adminMiddleware, async (req, res) => {
    try {
        const students = await Student.findAll({
            limit: 2
        })
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

router.get("/get/restores", async (req, res) => {
    try {
        const students = await Student.findAll({
            paranoid: false,
            where: {
                daletedAt: {
                    [Op.not]: null
                }
            },
            include: [{
                    model: Program,
                },
                {
                    model: StudentStatus,
                },
                {
                    model: User,
                },
            ],
        })
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

router.put("/:id/restore", adminMiddleware, async (req, res) => {
    const stu_id = req.params.id
    try {
        await Student.restore({
            where: {
                stu_id
            }
        });
        return res.status(200).json({
            ok: true,
            message: "กู้คืนข้อมูลสำเร็จ"
        })
    } catch (error) {
        return res.status(200).json({
            ok: false,
            message: "กู้คืนข้อมูลไม่สำเร็จ"
        })
    }
})
router.put("/:id", adminMiddleware, async (req, res) => {
    const stuid = req.params.id
    const stuData = req.body
    try {
        console.log(stuid);
        console.log(stuData);
        await Student.update(stuData, {
            where: {
                stu_id: stuid
            },
        });
        return res.status(200).json({
            ok: true,
            message: "แก้ไขข้อมูลสำเร็จ"
        })
    } catch (error) {
        let field = "";

        if (error.errors && error.errors.length > 0) {
            field = error.errors[0].path;
            field = field === "stu_id" ? "รหัสนักศึกษา" : field === "email" ? "อีเมล" : field;
        }

        return res.status(401).json({
            ok: false,
            message: `${field} ถูกเพิ่มไปแล้ว`
        });
    }
})

router.post("/", adminMiddleware, async (req, res) => {
    const studentData = req.body
    try {
        await Student.create(studentData)
        return res.status(200).json({
            ok: true,
            message: "เพิ่มนักศึกษาสำเร็จ"
        })
    } catch (error) {
        ok = false
        let field = error.errors.map(e => e.path)
        field = field == "stu_id" ? "รหัสนักศึกษา" : field == "email" ? "อีเมล" : field
        return res.status(401).json({
            ok: false,
            message: `${field} ถูกเพิ่มไปแล้ว`
        })
    }
})

router.delete("/:id", adminMiddleware, async (req, res) => {
    const stu_id = req.params.id
    try {
        await Student.destroy({
            where: {
                stu_id
            }
        })
        return res.status(200).json({
            ok: true,
            message: "ลบข้อมูลนักศึกษาสำเร็จ"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})
router.delete("/:id/force", adminMiddleware, async (req, res) => {
    const stu_id = req.params.id
    try {
        await Student.destroy({
            where: {
                stu_id
            },
            force: true
        })
        return res.status(200).json({
            ok: true,
            message: "ลบข้อมูลนักศึกษาสำเร็จ"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "ข้อมูลอื่นได้รับผลกระทบจาการลบ ไม่สามารถลบได้"
        })
    }
})

router.delete("/multiple/delete", adminMiddleware, async (req, res) => {
    const {
        students
    } = req.body
    try {
        // console.log(students);
        for (const id of students) {
            await Student.destroy({
                where: {
                    id
                }
            })
        }
        return res.status(200).json({
            ok: true,
            message: "ลบข้อมูลนักศึกษาสำเร็จ"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

router.get("/programs/:pid/acadyear/:acad", adminMiddleware, async (req, res) => {
    const pid = req.params.pid
    const acad = req.params.acad

    if (!pid && !acad) {
        return res.status(400).json({
            ok: false,
            message: "Provide program id or academic year."
        })
    }
    if (!Number.isInteger(parseInt(acad))) {
        return res.status(400).json({
            ok: false,
            message: "Academic year must be integer."
        })
    }

    try {
        const students = await Student.findAll({
            where: {
                acadyear: acad
            },
            include: [{
                    model: Program,
                    where: {
                        program: pid
                    }
                },
                {
                    model: StudentStatus,
                },
                {
                    model: User,
                },
            ],
        })
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

module.exports = router