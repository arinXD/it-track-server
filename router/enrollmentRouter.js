var express = require('express');
var router = express.Router();
const models = require('../models');
const Student = models.Student
const Enrollment = models.Enrollment
const Subject = models.Subject
const {
    Op
} = require("sequelize");
const isAdmin = require('../middleware/adminMiddleware');
const {
    convertGrade
} = require('../utils/grade');
const {
    findSubjectByCode
} = require('../utils/subject');

router.get("/", async (req, res) => {
    const students = await Student.findAll({
        limit: 5,
        include: {
            model: Enrollment,
            attributes: ["id", "grade"],
            include: {
                model: Subject,
                attributes: ["subject_code", "title_th", "title_en", "credit"],
            }
        },
    })
    return res.status(200).json({
        ok: true,
        data: students
    })
})
router.get("/:id", async (req, res) => {
    const id = req.params.id
    try {
        const students = await Student.findOne({
            where: {
                stu_id: {
                    [Op.like]: `%${id}%`,
                },
            },
            include: {
                model: Enrollment,
                attributes: ["subject_id", "grade"],
                include: {
                    model: Subject,
                    attributes: ["subject_code", "title_th", "title_en", "credit"],
                }
            },
        });
        return res.status(200).json({
            ok: true,
            data: students,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error.",
        })
    }
})

router.get("/:stu_id/:subject_id/:enrollyear", isAdmin, async (req, res) => {
    const stu_id = req.params.stu_id
    const subject_id = req.params.subject_id
    const enrollyear = req.params.enrollyear
    let existEnroll
    try {
        existEnroll = await Enrollment.findOne({
            where: {
                [Op.and]: [{
                        stu_id: {
                            [Op.like]: `%${stu_id}%`
                        }
                    },
                    {
                        subject_id: {
                            [Op.like]: `%${subject_id}%`
                        }
                    },
                    {
                        enroll_year: {
                            [Op.like]: `%${enrollyear}%`
                        }
                    },
                ]
            },
        })
    } catch (error) {
        return res.status(400).json({
            ok: false,
            data: existEnroll,
        })
    }

    return res.status(200).json({
        ok: true,
        data: existEnroll,
    })

})

router.post('/', isAdmin, async (req, res) => {
    const enroll = req.body
    try {
        await Enrollment.upsert(enroll)
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: true,
            message: "เพิ่มข้อมูลไม่สำเร็จ",
        })
    }
    return res.status(200).json({
        ok: true,
        message: "เพิ่มข้อมูลสำเร็จ",
    })
})

router.delete("/single/:id", isAdmin, async (req, res) => {
    const id = req.params.id
    try {
        await Enrollment.destroy({
            where: {
                id
            },
            force: true
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: true,
            message: "ลบไม่สำเร็จ",
        })
    }
    return res.status(200).json({
        ok: true,
        message: "ลบข้อมูลสำเร็จ",
    })
})

router.delete("/multiple", isAdmin, async (req, res) => {
    const enrolls = req.body
    try {
        for (const enroll of enrolls) {
            await Enrollment.destroy({
                where: {
                    id: enroll
                },
                force: true
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: true,
            message: "ลบไม่สำเร็จ",
        })
    }
    return res.status(200).json({
        ok: true,
        message: "ลบข้อมูลสำเร็จ",
    })
})

module.exports = router