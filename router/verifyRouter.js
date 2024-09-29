const express = require('express');
const router = express.Router();
const models = require('../models');
const Verify = models.Verify;
const { Op, where } = require('sequelize');
const adminMiddleware = require("../middleware/adminMiddleware");
const { log } = require('console');
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
const SemiSubGroup = models.SemiSubGroup
const SemiSubgroupSubject = models.SemiSubgroupSubject
const ConditionVerify = models.ConditionVerify
const ConditionSubgroupVerify = models.ConditionSubgroupVerify
const ConditionCategoryVerify = models.ConditionCategoryVerify

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
        const verify_id = await Verify.findOne({
            where: {
                verify: id
            },
            attributes: ["id"]
        })
        // console.log(verify_id);

        const data = await Verify.findOne({
            where: {
                verify: id
            },
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
                        verify_id: verify_id?.dataValues?.id,
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
                                        }
                                        ,
                                        {
                                            model: Verify,
                                            where: {
                                                id: verify_id?.dataValues?.id
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
                                        }
                                        , {
                                            model: Verify,
                                            where: {
                                                id: verify_id?.dataValues?.id
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
                                        }, {
                                            model: Verify,
                                            where: {
                                                id: verify_id?.dataValues?.id
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
    const { verify_id, group_id, subjects } = req.body;
    try {
        if (!Array.isArray(subjects)) {
            return res.status(400).json({
                ok: false,
                message: "Subjects must be an array."
            });
        }

        for (const subject_id of subjects) {
            const subGroupSubjectExists = await SubgroupSubject.findOne({
                where: { verify_id, subject_id }
            });

            const semisubgroupgroupSubjectExists = await SemiSubgroupSubject.findOne({
                where: { verify_id, subject_id }
            });

            if (subGroupSubjectExists) {
                return res.status(400).json({
                    ok: false,
                    message: `The subject ${subject_id} already exists in SubgroupSubject.`
                });
            }

            if (semisubgroupgroupSubjectExists) {
                return res.status(400).json({
                    ok: false,
                    message: `The subject ${subject_id} already exists in SemiSubgroupSubject.`
                });
            }

            let groupSubject = await GroupSubject.findOne({
                where: { subject_id, verify_id }
            });

            if (!groupSubject) {
                groupSubject = await GroupSubject.create({
                    verify_id,
                    subject_id,
                    group_id
                });
            } else {
                groupSubject.group_id = group_id;
                await groupSubject.save();
            }

            const existingSubjectVerify = await SubjectVerify.findOne({
                where: { subject_id, verify_id }
            });

            if (!existingSubjectVerify) {
                await SubjectVerify.create({
                    verify_id,
                    subject_id
                });
            }
        }

        return res.status(201).json({
            ok: true,
            message: "Subjects added successfully."
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
    const { verify_id, sub_group_id, subjects } = req.body;
    try {

        if (!Array.isArray(subjects)) {
            return res.status(400).json({
                ok: false,
                message: "Subjects must be an array."
            });
        }

        for (const subject_id of subjects) {
            const groupSubjectExists = await GroupSubject.findOne({
                where: { verify_id, subject_id }
            });

            const semisubgroupgroupSubjectExists = await SemiSubgroupSubject.findOne({
                where: { verify_id, subject_id }
            });


            if (groupSubjectExists) {
                return res.status(400).json({
                    ok: false,
                    message: `The subject ${subject_id} already exists in GroupSubject.`
                });
            }


            if (semisubgroupgroupSubjectExists) {
                return res.status(400).json({
                    ok: false,
                    message: `The subject ${subject_id} already exists in SemiSubgroupSubject.`
                });
            }

            let subgroupSubject = await SubgroupSubject.findOne({
                where: { subject_id, verify_id }
            });

            if (subgroupSubject) {
                subgroupSubject.sub_group_id = sub_group_id;
                await subgroupSubject.save();
            } else {
                subgroupSubject = await SubgroupSubject.create({
                    verify_id,
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
        }

        return res.status(201).json({
            ok: true,
            message: `Subjects added successfully.`
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        });
    }
});

router.post("/semisubgroup", adminMiddleware, async (req, res) => {
    const { verify_id, semi_sub_group_id, subjects } = req.body;
    try {

        if (!Array.isArray(subjects)) {
            return res.status(400).json({
                ok: false,
                message: "Subjects must be an array."
            });
        }

        for (const subject_id of subjects) {
            const groupSubjectExists = await GroupSubject.findOne({
                where: { verify_id, subject_id }
            });

            const subGroupSubjectExists = await SubgroupSubject.findOne({
                where: { verify_id, subject_id }
            });

            if (groupSubjectExists) {
                return res.status(400).json({
                    ok: false,
                    message: `The subject ${subject_id} already exists in GroupSubject.`
                });
            }

            if (subGroupSubjectExists) {
                return res.status(400).json({
                    ok: false,
                    message: `The subject ${subject_id} already exists in SubgroupSubject.`
                });
            }

            let semisubgroupSubject = await SemiSubgroupSubject.findOne({
                where: { subject_id, verify_id }
            });

            if (semisubgroupSubject) {
                semisubgroupSubject.semi_sub_group_id = semi_sub_group_id;
                await semisubgroupSubject.save();
            } else {
                semisubgroupSubject = await SemiSubgroupSubject.create({
                    verify_id,
                    subject_id,
                    semi_sub_group_id
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
        }

        return res.status(201).json({
            ok: true,
            message: `Subjects added successfully.`
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        });
    }
});

router.post("/category", adminMiddleware, async (req, res) => {
    const { verify_id, category_id } = req.body;

    try {
        if (!verify_id || !category_id) {
            return res.status(400).json({ ok: false, message: 'verify_id and category_id are required' });
        }

        const existingPair = await CategoryVerify.findOne({ where: { verify_id, category_id } });
        if (existingPair) {
            return res.status(201).json({
                ok: false,
                message: `หมวดหมู่วิชามีอยู่แล้ว`
            });
        }

        const newvfData = {
            verify_id,
            category_id
        };
        const newvf = await CategoryVerify.create(newvfData);

        return res.status(201).json({
            ok: true,
            message: `CategoryVerify added successfully.`
        });
    } catch (error) {
        console.log(error);
    }
});

router.delete("/group/:id/:verify_id", adminMiddleware, async (req, res) => {
    const id = req.params.id;
    const { verify_id } = req.params;
    try {
        const groupSubject = await GroupSubject.findOne({
            where: { id },
            include: [
                {
                    model: Subject,
                }
            ]
        });

        if (!groupSubject) {
            return res.status(404).json({
                ok: false,
                message: "GroupSubject not found."
            });
        }

        const subject_id = groupSubject.subject_id;
        const subject_code = groupSubject.Subject.subject_code;

        await GroupSubject.destroy({
            where: { subject_id, verify_id }
        });

        await SubjectVerify.destroy({
            where: { subject_id, verify_id }
        });

        return res.status(200).json({
            ok: true,
            message: `ลบวิชา ${subject_code} สำเร็จ`
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        });
    }
});

router.delete("/subgroup/:id/:verify_id", adminMiddleware, async (req, res) => {
    const id = req.params.id;
    const { verify_id } = req.params;
    try {
        const subgroupSubject = await SubgroupSubject.findOne({
            where: { subject_id: id },
            include: [
                {
                    model: Subject,
                }
            ]
        });

        if (!subgroupSubject) {
            return res.status(404).json({
                ok: false,
                message: "SubgroupSubject not found."
            });
        }

        const subject_id = subgroupSubject.subject_id;
        const subject_code = subgroupSubject.Subject.subject_code;

        await SubgroupSubject.destroy({
            where: { subject_id, verify_id }
        });

        await SubjectVerify.destroy({
            where: { subject_id, verify_id }
        });

        return res.status(200).json({
            ok: true,
            message: `ลบวิชา ${subject_code} สำเร็จ`
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        });
    }
});

router.delete("/semisubgroup/:id/:verify_id", adminMiddleware, async (req, res) => {
    const id = req.params.id;
    const { verify_id } = req.params;
    try {
        const semisubgroupSubject = await SemiSubgroupSubject.findOne({
            where: { subject_id: id },
            include: [
                {
                    model: Subject,
                }
            ]
        });

        if (!semisubgroupSubject) {
            return res.status(404).json({
                ok: false,
                message: "SemiSubgroupSubject not found."
            });
        }

        const subject_id = semisubgroupSubject.subject_id;
        const subject_code = semisubgroupSubject.Subject.subject_code;

        await SemiSubgroupSubject.destroy({
            where: { subject_id, verify_id }
        });

        await SubjectVerify.destroy({
            where: { subject_id, verify_id }
        });

        return res.status(200).json({
            ok: true,
            message: `ลบวิชา ${subject_code} สำเร็จ`
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        });
    }
});


router.delete("/category/:id/:verify_id", adminMiddleware, async (req, res) => {
    const id = req.params.id;
    const { verify_id } = req.params;
    try {
        const category = await CategoryVerify.findOne({
            where: { category_id: id },
            include: [
                {
                    model: Categorie,
                }
            ]
        });

        if (!category) {
            return res.status(404).json({
                ok: false,
                message: "Category not found."
            });
        }

        const category_id = category.id;
        const category_title = category.Categorie.category_title;

        await CategoryVerify.destroy({
            where: { id: category_id, verify_id }
        });

        return res.status(200).json({
            ok: true,
            message: `ลบหมวดหมู่วิชา ${category_title} สำเร็จ`
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        });
    }
});

router.delete("/:id", adminMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        // Find the Verify record and include related models for foreign key constraint checking
        const verify = await Verify.findByPk(id, {
            include: [
                { model: SubjectVerify },
                { model: ConditionVerify },
                { model: ConditionSubgroupVerify },
                { model: CategoryVerify },
                { model: ConditionCategoryVerify },
                { model: GroupSubject },
                { model: SemiSubgroupSubject },
                { model: SubgroupSubject },
            ],
        });

        if (!verify) {
            return res.status(404).json({
                ok: false,
                message: 'ไม่พบแบบฟอร์มที่ต้องการลบ',
            });
        }

        // Check for associated records and prevent deletion if any exist
        const hasAssociatedRecords = [
            verify.SubjectVerifies.length,
            verify.ConditionVerifies.length,
            verify.ConditionSubgroupVerifies.length,
            verify.CategoryVerifies.length,
            verify.ConditionCategoryVerifies.length,
            verify.GroupSubjects.length,
            verify.SemiSubgroupSubjects.length,
            verify.SubgroupSubjects.length,
        ].some((count) => count > 0);

        if (hasAssociatedRecords) {
            return res.status(400).json({
                ok: false,
                message: 'ไม่สามารถลบได้ กรุณาลบข้อมูลที่เกี่ยวข้องก่อน',
            });
        }

        // Proceed with deletion if no related records exist
        await Verify.destroy({ where: { id } });

        return res.status(200).json({
            ok: true,
            message: "ลบแบบฟอร์มสำเร็จ",
        });

    } catch (error) {
        console.error("Delete Verify Error:", error);
        return res.status(500).json({
            ok: false,
            message: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์",
        });
    }
});




module.exports = router;
