const express = require('express');
const router = express.Router();
const models = require('../models');
const Student = models.Student
const Enrollment = models.Enrollment
const Subject = models.Subject
const Selection = models.Selection
const Track = models.Track
const { Op, QueryTypes } = require("sequelize");
const isAdmin = require('../middleware/adminMiddleware');
const isAuth = require('../middleware/authMiddleware');
const validateStudent = require('../middleware/validateStudent');

router.get("/", isAdmin, async (req, res) => {
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
router.get("/:stuid", validateStudent, async (req, res) => {
    const id = req.params.stuid
    try {
        const students = await Student.findOne({
            where: {
                stu_id: {
                    [Op.like]: `%${id}%`,
                },
            },
            include: [
                {
                    model: Enrollment,
                    attributes: ["subject_id", "grade"],
                    include: {
                        model: Subject,
                        attributes: ["subject_code", "title_th", "title_en", "credit"],
                    }
                },
                {
                    model: Selection,
                    attributes: ["result"],
                    include: {
                        model: Track
                    }
                }
            ],
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

router.get("/:acadyear/gpa", async (req, res) => {
    const acadyear = parseInt(req.params.acadyear)
    if (typeof acadyear != "number") {
        return res.status(400).json({
            ok: false,
            acadyear,
            message: "acadyear must be number.",
        })
    }
    try {
        let allGpa = await models.sequelize.query(`
        SELECT Students.stu_id AS stuid,
        SUM((CASE 
                WHEN Enrollments.grade IN ('A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F') THEN 
                    CASE Enrollments.grade
                        WHEN 'A' THEN 4
                        WHEN 'B+' THEN 3.5
                        WHEN 'B' THEN 3
                        WHEN 'C+' THEN 2.5
                        WHEN 'C' THEN 2
                        WHEN 'D+' THEN 1.5
                        WHEN 'D' THEN 1
                        WHEN 'F' THEN 0
                    END
                ELSE 0
            END) * Subjects.credit) / 
            (SELECT SUM(Subjects.credit)
                FROM Subjects, Enrollments
                WHERE Subjects.subject_id = Enrollments.subject_id
                AND Students.stu_id = Enrollments.stu_id
                AND Enrollments.grade IN ('A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F')
                GROUP BY Enrollments.stu_id) as gpa
        FROM Enrollments
        JOIN Students ON Enrollments.stu_id = Students.stu_id
        JOIN Subjects ON Enrollments.subject_id = Subjects.subject_id
        WHERE Students.acadyear = ${acadyear}
        GROUP BY stuid
        ORDER BY stuid ASC`, {
            type: QueryTypes.SELECT
        });
        return res.status(200).json({
            ok: true,
            data: allGpa,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error.",
            error
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