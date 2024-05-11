const express = require('express');
const router = express.Router();
const models = require('../models');
const Verify = models.Verify;
const { Op } = require('sequelize');
const adminMiddleware = require("../middleware/adminMiddleware");
const Program = models.Program;
const Subject = models.Subject
const Categorie = models.Categorie
const SubGroup = models.SubGroup
const Group = models.Group
const GroupSubject = models.GroupSubject
const SubjectVerify = models.SubjectVerify
const SubgroupSubject = models.SubgroupSubject
const Track = models.Track
const subjectAttr = ["subject_code", "title_th", "title_en", "credit"]

router.get("/", async (req, res) => {
    try {
        const verify = await Verify.findAll();
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


router.post("/", adminMiddleware, async (req, res) => {
    const {
        verify,
        title,
        acadyear,
        program,
        main_at_least,
    } = req.body;

    try {
        const vf = await Verify.findOne({
            where: {
                verify
            }
        });

        if (!vf) {
            const newvfData = {
                verify,
                title,
                acadyear,
                program,
                main_at_least
            };
            const newvf = await Verify.create(newvfData);
            return res.status(201).json({
                ok: true,
                message: `เพิ่มแบบฟอร์มตรวจสอบจบปีการศึกษา ${verify} เรียบร้อย`,
                data: newvf
            });
        } else {
            return res.status(400).json({
                ok: false,
                message: `แบบฟอร์มตรวจสอบจบปีการศึกษา ${verify} ถูกเพิ่มไปแล้ว`
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        });
    }
});

router.get("/:id", async (req, res) => {
    const id = req.params.id
    try {
        const data = await Verify.findOne({
            where: {
                verify: id
            },
            include: [
                {
                    model: Program,
                },
                {
                    model: SubjectVerify,
                    include: [
                        {
                            model: Subject,
                            include: [
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
                                                            model: Categorie
                                                        }
                                                    ]
                                                }
                                            ]
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
        });
        return res.status(200).json({
            ok: true,
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

router.post("/group", adminMiddleware, async (req, res) => {
    const { verify_id, subject_id, group_id } = req.body;

    try {
        const subGroupSubjectExists = await SubgroupSubject.findOne({
            where: { subject_id }
        });

        if (subGroupSubjectExists) {
            return res.status(400).json({
                ok: false,
                message: `The subject ${subject_id} already exists in SubgroupSubject.`
            });
        }

        let groupSubject = await GroupSubject.findOne({
            where: { subject_id }
        });

        if (groupSubject) {
            groupSubject.group_id = group_id;
            await groupSubject.save();
        } else {
            groupSubject = await GroupSubject.create({
                subject_id,
                group_id
            });
        }

        const existingSubjectVerify = await SubjectVerify.findOne({
            where: { subject_id, verify_id }
        });

        if (existingSubjectVerify) {
            return res.status(200).json({
                ok: true,
                message: `Subject ${subject_id} already exists in SubjectVerify for verify_id ${verify_id}.`
            });
        } else {
            const newSubjectVerify = await SubjectVerify.create({
                verify_id,
                subject_id
            });
        }

        return res.status(201).json({
            ok: true,
            message: `Subject ${subject_id} added successfully.`
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        });
    }
});



router.post("/subgroup", adminMiddleware, async (req, res) => {
    const { verify_id, subject_id, sub_group_id } = req.body;

    try {
        const groupSubjectExists = await GroupSubject.findOne({
            where: { subject_id }
        });

        if (groupSubjectExists) {
            return res.status(400).json({
                ok: false,
                message: `The subject ${subject_id} already exists in GroupSubject.`
            });
        }

        let subgroupSubject = await SubgroupSubject.findOne({
            where: { subject_id }
        });

        if (subgroupSubject) {
            subgroupSubject.sub_group_id = sub_group_id;
            await subgroupSubject.save();
        } else {
            subgroupSubject = await SubgroupSubject.create({
                subject_id,
                sub_group_id
            });
        }

        const existingSubjectVerify = await SubjectVerify.findOne({
            where: { subject_id, verify_id }
        });

        if (existingSubjectVerify) {
            return res.status(200).json({
                ok: true,
                message: `Subject ${subject_id} already exists in SubjectVerify for verify_id ${verify_id}.`
            });
        } else {
            const newSubjectVerify = await SubjectVerify.create({
                verify_id,
                subject_id
            });
        }

        return res.status(201).json({
            ok: true,
            message: `Subject ${subject_id} added successfully.`
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
