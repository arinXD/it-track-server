const express = require('express');
const router = express.Router();
const models = require('../models');
const { Op } = require('sequelize');
const isAdmin = require("../middleware/adminMiddleware");
const isAuth = require('../middleware/authMiddleware');

const Verify = models.Verify;
const StudentVerify = models.StudentVerify;
const StudentVerifyDetail = models.StudentVerifyDetail
const StudentItVerifyGrade = models.StudentItVerifyGrade
const StudentCategoryVerify = models.StudentCategoryVerify
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

const subjectAttr = ["subject_code", "title_th", "title_en", "credit"]

router.get("/:program/:acadyear", isAuth, async (req, res) => {
    const { program, acadyear } = req.params;
    try {
        const data = await Verify.findOne({
            where: {
                program,
                acadyear: {
                    [Op.lte]: parseInt(acadyear)
                }
            },
            order: [['acadyear', 'DESC']],
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
        })
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

router.get("/:stu_id", isAuth, async (req, res) => {
    const { stu_id } = req.params;
    try {
        const sv = await StudentVerify.findOne({
            where: {
                stu_id
            },
            attributes: ["status"]
        });
        return res.status(200).json({
            ok: true,
            data: sv
        });
    } catch (error) {
        console.error('Error fetching stdverify:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
    }
});

router.post("/:verify_id/:stu_id", isAuth, async (req, res) => {
    const { verify_id, stu_id } = req.params;
    const { term, cum_laude, acadyear, status, subjects, tracksubject, studentcategory } = req.body;

    try {
        if (!Array.isArray(subjects)) {
            return res.status(400).json({
                ok: false,
                message: "Subjects must be an array."
            });
        }


        let sv = await StudentVerify.findOne({
            where: { verify_id, stu_id }
        });

        if (!sv) {
            sv = await StudentVerify.create({
                verify_id, stu_id, term, cum_laude, acadyear, status
            });
        }

        const svds = await StudentVerify.findOne({
            where: { verify_id, stu_id }
        });

        for (const sc of studentcategory) {
            const { category_id, verifySubj } = sc;

            // Find or create CategoryVerify entry
            const categoryVerify = await CategoryVerify.findOne({
                where: { verify_id, category_id }
            });

            if (categoryVerify) {
                // Create StudentCategoryVerify entries
                for (const subj of verifySubj) {
                    const { grade } = subj;

                    let group_subject_id = null;
                    let sub_group_subject_id = null;
                    let semi_sub_group_subject_id = null;

                    await StudentCategoryVerify.create({
                        student_verify_id: svds.id,
                        category_verify_id: categoryVerify.id,
                        subject_id: subj.subject_id,
                    });

                    const updatedScv = await StudentCategoryVerify.findOne({
                        where: { student_verify_id: svds.id, category_verify_id: categoryVerify.id }
                    });

                    await StudentVerifyDetail.create({
                        student_verify_id: svds.id,
                        subject_id: subj.subject_id,
                        grade,
                        group_subject_id,
                        sub_group_subject_id,
                        semi_sub_group_subject_id,
                        category_subject_id: updatedScv.id,
                    });
                }
            } else {
                // Handle the case where CategoryVerify doesn't exist
                console.error(`CategoryVerify with category_id ${category_id} not found.`);
            }
        }

        for (const subjectDetail of subjects) {
            const { type, subjects: subjectList } = subjectDetail;

            for (const subject of subjectList) {
                const { subject: s, grade } = subject;

                let group_subject_id = null;
                let sub_group_subject_id = null;
                let semi_sub_group_subject_id = null;
                let category_subject_id = null;

                if (type === 'group') {
                    const groupSubject = await GroupSubject.findOne({
                        where: { verify_id, subject_id: s.subject_id }
                    });
                    if (groupSubject) {
                        group_subject_id = groupSubject.id;
                    }
                }
                if (type === 'subgroup') {
                    const subGroupSubject = await SubgroupSubject.findOne({
                        where: { verify_id, subject_id: s.subject_id }
                    });
                    if (subGroupSubject) {
                        sub_group_subject_id = subGroupSubject.id;
                    }
                }
                if (type === 'semisubgroup') {
                    const semiSubGroupSubject = await SemiSubgroupSubject.findOne({
                        where: { verify_id, subject_id: s.subject_id }
                    });
                    if (semiSubGroupSubject) {
                        semi_sub_group_subject_id = semiSubGroupSubject.id;
                    }
                }

                // Create the entry in StudentVerifyDetail
                await StudentVerifyDetail.create({
                    student_verify_id: svds.id,
                    subject_id: s.subject_id,
                    grade,
                    group_subject_id,
                    sub_group_subject_id,
                    semi_sub_group_subject_id,
                    category_subject_id,
                });
            }
        }

        // Delete old StudentItVerifyGrade records for the given stu_id
        await StudentItVerifyGrade.destroy({
            where: { stu_id }
        });

        // Insert new StudentItVerifyGrade records
        for (const subtrack of tracksubject) {
            await StudentItVerifyGrade.create({
                stu_id: stu_id,
                subject_id: subtrack.subject_id,
                grade: subtrack.grade,
            });
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

module.exports = router;
