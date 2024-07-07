const express = require('express');
const router = express.Router();
const models = require('../models');
const Subject = models.Subject
const { Op } = require('sequelize');
const isAdmin = require('../middleware/adminMiddleware');
const isAuth = require('../middleware/authMiddleware');

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

router.get("/", isAdmin, async (req, res) => {
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

router.get("/student", isAuth, async (req, res) => {
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

router.get("/tracks/:track", isAuth, async (req, res) => {
    const track = (req.params.track).toLowerCase()
    try {
        const subjects = await Subject.findAll({
            where: {
                track
            }
        });
        let uniqueSubjects = subjects.filter((subject, index, self) =>
            index !== 0 && self.findIndex(s => s?.dataValues?.title_en === subject?.dataValues?.title_en) === index
        );
        uniqueSubjects = uniqueSubjects.map(subject => {
            if (subject?.dataValues?.title_en) {
                subject.title_en = subject.dataValues.title_en.split(" ").map(word => capitalize(word)).join(" ")
            }
            return subject
        })
        return res.status(200).json({
            ok: true,
            data: uniqueSubjects
        });
    } catch (error) {
        console.error('Error fetching subjects:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.post("/tracks/:track", isAdmin, async (req, res) => {
    const track = (req.params.track).toLowerCase()
    const subjects = req.body
    try {
        for (const subject_id of subjects) {
            await Subject.update({
                track
            }, {
                where: {
                    subject_id
                }
            });
        }
        return res.status(200).json({
            ok: true,
            message: "เพิ่มวิชาภายในแทร็กเรียบร้อย"
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Internal Server Error'
        });
    }
});

router.delete("/tracks/:track", isAdmin, async (req, res) => {
    const subjects = req.body
    try {
        for (const subject_id of subjects) {
            await Subject.update({
                track: null
            }, {
                where: {
                    subject_id
                }
            });
        }
        return res.status(200).json({
            ok: true,
            message: "ลบวิชาภายในแทร็กเรียบร้อย"
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Internal Server Error'
        });
    }
});

router.get("/tracks/:track/others", isAdmin, async (req, res) => {
    const track = (req.params.track).toLowerCase()
    const findnSubjects = await Subject.findAll({
        where: {
            track,
        }
    });
    const defaultSubjects = findnSubjects.map(subject => subject?.dataValues?.subject_code)
    try {
        const subjects = await Subject.findAll({
            where: {
                track: null,
                subject_code: {
                    [Op.notIn]: defaultSubjects
                }
            },
        });
        let uniqueSubjects = subjects.filter((subject, index, self) =>
            index !== 0 && self.findIndex(s => s?.dataValues?.title_en === subject?.dataValues?.title_en) === index
        );
        uniqueSubjects = uniqueSubjects.map(subject => {
            if (subject?.dataValues?.title_en) {
                subject.title_en = subject.dataValues.title_en.split(" ").map(word => capitalize(word)).join(" ")
            }
            return subject
        })
        return res.status(200).json({
            ok: true,
            data: uniqueSubjects
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
            // semester,
            subject_code,
            title_th,
            title_en,
            information,
            credit,
            track,
            // sub_group_id,
            // group_id,
            // acadyear
        } = req.body;

        const newSubject = await Subject.create({
            // semester: semester,
            subject_code: subject_code,
            title_th: title_th,
            title_en: title_en,
            information: information,
            credit: credit,
            track: track,
            deletedAt: null
            // sub_group_id: sub_group_id,
            // group_id: group_id,
            // acadyear: acadyear,
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
            subject_code,
            title_th,
            title_en,
            information,
            credit,
            track,
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
            subject_code: subject_code,
            title_th: title_th,
            title_en: title_en,
            information: information,
            credit: credit,
            track: track,
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

router.get("/getSubjectByCode/:subject_code", async (req, res) => {
    try {
        const { subject_code } = req.params;

        const existingSubject = await Subject.findOne({
            where: {
                subject_code: subject_code
            }
        });

        if (existingSubject) {
            return res.status(200).json({
                ok: true,
                exists: true,
                data: existingSubject
            });
        } else {
            return res.status(200).json({
                ok: true,
                exists: false,
                message: 'Subject not found'
            });
        }
    } catch (error) {
        console.error('Error fetching subject by code:', error);
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