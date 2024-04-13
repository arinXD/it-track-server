var express = require('express');
var router = express.Router();
const models = require('../models');
const Subject = models.Subject
const {
    Op
} = require('sequelize');
const isAdmin = require('../middleware/adminMiddleware');

router.get("/", async (req, res) => {
    try {
        const subjects = await Subject.findAll();
        return res.status(200).json({
            ok: true,
            data: subjects
        });
    } catch (error) {
        console.error('Error fetching subjects:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.get("/find/:subject", isAdmin, async (req, res) => {
    const subject = req.params.subject
    try {
        const subjects = await Subject.findAll({
            where: {
                [Op.or]: [{
                        subject_code: {
                            [Op.like]: `%${subject}%`
                        }
                    },
                    {
                        title_th: {
                            [Op.like]: `%${subject}%`
                        }
                    },
                    {
                        title_en: {
                            [Op.like]: `%${subject}%`
                        }
                    },
                ]
            },
        })
        return res.status(200).json({
            ok: true,
            data: subjects
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

router.get("/track/selection", isAdmin, async (req, res) => {
    const defaultSubjects = req.query.subjects
    try {
        const subjects = await Subject.findAll({
            where: {
                [Op.and]: [{
                        [Op.or]: [{
                                subject_code: {
                                    [Op.like]: 'SC%'
                                }
                            },
                            {
                                subject_code: {
                                    [Op.like]: 'CP%'
                                }
                            }
                        ]
                    },
                    {
                        subject_code: {
                            [Op.notIn]: defaultSubjects
                        }
                    }
                ]
            },
        });
        return res.status(200).json({
            ok: true,
            data: subjects
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

router.post("/insertSubject", async (req, res) => {
    try {
        const {
            semester,
            subject_code,
            title_th,
            title_en,
            information,
            credit,
            sub_group_id,
            group_id,
            acadyear
        } = req.body;

        const newSubject = await Subject.create({
            semester: semester,
            subject_code: subject_code,
            title_th: title_th,
            title_en: title_en,
            information: information,
            credit: credit,
            sub_group_id: sub_group_id,
            group_id: group_id,
            acadyear: acadyear,
        });

        return res.status(201).json({
            ok: true,
            data: newSubject
        });
    } catch (error) {
        console.error('Error inserting subjects:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});
router.post("/insertSubjectsFromExcel", async (req, res) => {
    try {
        const subjects = req.body;
        const insertedSubjects = [];
        const duplicateSubjects = [];

        for (const subject of subjects) {
            const existingSubject = await Subject.findOne({
                where: {
                    subject_code: subject.subject_code
                }
            });

            if (existingSubject) {
                duplicateSubjects.push(subject);
            } else {
                const newSubject = await Subject.create(subject);
                insertedSubjects.push(newSubject);
            }
        }
        return res.status(201).json({
            data: insertedSubjects,
            duplicates: duplicateSubjects,
            message: 'Subjects processed successfully'
        });
    } catch (error) {
        console.error('Error processing subjects:', error);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const subjectId = req.params.id;
        const subject = await Subject.findOne({
            where: {
                subject_id: subjectId
            }
        });

        if (!subject) {
            return res.status(404).json({
                ok: false,
                error: 'Subject not found'
            });
        }

        return res.status(200).json({
            ok: true,
            data: subject
        });
    } catch (error) {
        console.error('Error fetching subject:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.post("/updateSubject/:id", async (req, res) => {
    try {
        const subjectId = req.params.id;
        const {
            semester,
            subject_code,
            title_th,
            title_en,
            information,
            credit,
            sub_group_id,
            group_id,
            acadyear
        } = req.body;
        const updateSubject = await Subject.findOne({
            where: {
                subject_id: subjectId
            }
        });

        if (!updateSubject) {
            return res.status(404).json({
                ok: false,
                error: 'Subject not found'
            });
        }

        await updateSubject.update({
            semester: semester,
            subject_code: subject_code,
            title_th: title_th,
            title_en: title_en,
            information: information,
            credit: credit,
            sub_group_id: sub_group_id,
            group_id: group_id,
            acadyear: acadyear,
        });

        return res.status(200).json({
            ok: true,
            data: updateSubject
        });
    } catch (error) {
        console.error('Error updating Subject:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});



router.delete("/deleteSubject/:subject_id", async (req, res) => {
    try {
        const subjectId = req.params.subject_id;

        const result = await Subject.destroy({
            where: {
                subject_id: subjectId
            }
        });

        if (result === 0) {
            return res.status(404).json({
                ok: false,
                error: 'Subject not found'
            });
        }

        return res.status(200).json({
            ok: true,
            message: 'Subject deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting Subject:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});



module.exports = router