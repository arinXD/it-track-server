const express = require('express');
const router = express.Router();
const models = require('../models');
const { Op } = require('sequelize');
const isAdmin = require("../middleware/adminMiddleware");
const isAuth = require('../middleware/authMiddleware');

const Verify = models.Verify;
const Student = models.Student
const StudentVerify = models.StudentVerify;
const StudentVerifyDetail = models.StudentVerifyDetail
const StudentCategoryVerify = models.StudentCategoryVerify
const StudentItVerifyGrade = models.StudentItVerifyGrade
const Program = models.Program;
const Subject = models.Subject
const Categorie = models.Categorie
const SubGroup = models.SubGroup
const Group = models.Group
const GroupSubject = models.GroupSubject
const SubjectVerify = models.SubjectVerify
const SubgroupSubject = models.SubgroupSubject
const Track = models.Track
const CategoryVerify = models.CategoryVerify
const SemiSubgroupSubject = models.SemiSubgroupSubject
const SemiSubGroup = models.SemiSubGroup

router.get("/", isAdmin, async (req, res) => {
    try {
        const verify = await StudentVerify.findAll({
            include:[{
                model: Student
            }]
        });
        return res.status(200).json({
            ok: true,
            data: verify
        });
    } catch (error) {
        console.error('Error fetching verify:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.get("/it/:stu_id", isAdmin, async (req, res) => {
    const stu_id = req.params.stu_id;
    try {
        const verify = await StudentItVerifyGrade.findAll({
            where: {
                stu_id,
            },
            include: [{
                model: Subject
            }]
        });
        return res.status(200).json({
            ok: true,
            data: verify
        });
    } catch (error) {
        console.error('Error fetching verify:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});


router.get("/:stu_id", isAdmin, async (req, res) => {
    const stu_id = req.params.stu_id;
    try {
        // Fetch the StudentVerify record using the stu_id
        const studentVerify = await StudentVerify.findOne({
            where: {
                stu_id,
            }
        });

        if (!studentVerify) {
            return res.status(404).json({
                ok: false,
                message: "StudentVerify record not found."
            });
        }

        // Extract the verify_id from the fetched StudentVerify record
        const verify_id = studentVerify.verify_id;

        // Fetch the StudentVerify record with associated models
        const sv = await StudentVerify.findOne({
            where: {
                stu_id,
            },
            include: [
                {
                    model: Verify,
                    include: [
                        {
                            model: Program,
                        },
                        {
                            model: CategoryVerify,
                            include: [
                                {
                                    model: Categorie,
                                }
                            ]
                        },
                        {
                            model: SubjectVerify,
                            where: {
                                verify_id,
                            },
                            required: false,
                            include: [
                                {
                                    model: Subject,
                                    include: [
                                        {
                                            model: SemiSubgroupSubject,
                                            include: [
                                                {
                                                    model: SemiSubGroup,
                                                    include: [
                                                        {
                                                            model: SubGroup,
                                                            include: [
                                                                {
                                                                    model: Group,
                                                                    include: [
                                                                        {
                                                                            model: Categorie,
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    model: Verify,
                                                    where: {
                                                        id: verify_id
                                                    },
                                                }
                                            ]
                                        },
                                        {
                                            model: SubgroupSubject,
                                            include: [
                                                {
                                                    model: SubGroup,
                                                    include: [
                                                        {
                                                            model: Group,
                                                            include: [
                                                                {
                                                                    model: Categorie,
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    model: Verify,
                                                    where: {
                                                        id: verify_id
                                                    },
                                                }
                                            ]
                                        },
                                        {
                                            model: GroupSubject,
                                            include: [
                                                {
                                                    model: Group,
                                                    include: [
                                                        {
                                                            model: Categorie
                                                        }
                                                    ]
                                                },
                                                {
                                                    model: Verify,
                                                    where: {
                                                        id: verify_id
                                                    },
                                                }
                                            ]
                                        },
                                        {
                                            model: Track,
                                        }
                                    ]
                                }
                            ]
                        },
                    ]
                },
                {
                    model: StudentVerifyDetail,
                    include: [
                        {
                            model: StudentCategoryVerify,
                            include: [
                                {
                                    model: CategoryVerify,
                                    include: [
                                        {
                                            model: Categorie
                                        }
                                    ]
                                },
                            ]
                        }, {
                            model: Subject,
                        }
                    ]
                },
                {
                    model: StudentCategoryVerify,
                    include: [
                        {
                            model: CategoryVerify,
                            include: [
                                {
                                    model: Categorie
                                }
                            ]
                        },
                    ]
                },
                {
                    model: Student
                }
            ]
        });

        return res.status(200).json({
            ok: true,
            data: sv
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        });
    }
});


router.post("/status/:stu_id", isAuth, async (req, res) => {
    const { stu_id } = req.params;

    try {
        const studentVerify = await StudentVerify.findOne({
            where: {
                stu_id,
            },
        });

        if (!studentVerify) {
            return res.status(404).json({
                ok: false,
                message: "StudentVerify record not found."
            });
        }

        // Update status from 1 to 2
        if (studentVerify.status === 1) {
            await studentVerify.update({ status: 2 });
        }


        return res.status(201).json({
            ok: true,
            message: "Status updated successfully."
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        });
    }
});



module.exports = router;