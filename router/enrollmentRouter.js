var express = require('express');
var router = express.Router();
const models = require('../models');
const Student = models.Student
const Enrollment = models.Enrollment
const Subject = models.Subject
const { Op } = require("sequelize");

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

module.exports = router