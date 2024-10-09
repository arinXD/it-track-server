const express = require('express');
const router = express.Router();
const models = require('../models');
const { Op, where } = require('sequelize');
const isAdmin = require("../middleware/adminMiddleware");
const isAuth = require('../middleware/authMiddleware');

const Verify = models.Verify;
const Student = models.Student
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
const StudentVerifyApprovements = models.StudentVerifyApprovements
const Teacher = models.Teacher
const User = models.User
const Admin = models.Admin
const Notification = models.Notification

const subjectAttr = ["subject_code", "title_th", "title_en", "credit"]

router.get("/:program/:acadyear", isAuth, async (req, res) => {
    const { program, acadyear } = req.params;
    try {

        const verify = await Verify.findOne({
            where: {
                program,
                acadyear: {
                    [Op.lte]: parseInt(acadyear)
                }
            },
            attributes: ["id"],
        });

        if (!verify) {
            return res.status(404).json({
                ok: false,
                message: "No records found."
            });
        }

        const data = await Verify.findOne({
            where: {
                id: verify.id,
                program,
                acadyear: {
                    [Op.lte]: parseInt(acadyear)
                }
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
                        verify_id: verify.id,
                    },
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
                                                id: verify.id
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
                                                id: verify.id
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
                                                id: verify.id
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

router.get("/grade/confirm/:stu_id", isAuth, async (req, res) => {
    const stu_id = req.params.stu_id;
    try {
        // Fetch the StudentVerify record using the stu_id
        const studentVerify = await StudentVerify.findOne({
            where: {
                stu_id,
            }
        });

        if (!studentVerify) {
            return res.status(200).json({
                ok: true,
                data: {} // Return an empty data object
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
        return res.status(200).json({
            ok: false,
            data: {} // Return an empty object
        });
    }
});

router.get("/grade/it/:stu_id", isAuth, async (req, res) => {
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

router.get("/status/verify/:stu_id", isAuth, async (req, res) => {
    const stu_id = req.params.stu_id;
    try {
        const studentVerify = await StudentVerify.findOne({
            where: {
                stu_id,
            },
        });

        // If student is not found, return empty data without an error
        if (!studentVerify) {
            return res.status(200).json({
                ok: true,
                data: [], // Return empty data array
            });
        }

        const verify = await StudentVerifyApprovements.findAll({
            where: {
                student_verify_id: studentVerify.id,
            },
            include: [{
                model: User,
                include: [
                    {
                        model: Teacher,
                    },
                    {
                        model: Admin,
                    },
                ]
            }],
        });

        return res.status(200).json({
            ok: true,
            data: verify,
        });
    } catch (error) {
        // Log the error only for debugging purposes, if necessary
        console.error('Error fetching verify:', error);
        return res.status(200).json({ // Return 200 with empty data in case of error
            ok: false,
            data: [], // Return empty data array
        });
    }
});

router.post("/:verify_id/:stu_id", isAuth, async (req, res) => {
    const { verify_id, stu_id } = req.params;
    const { term, cum_laude, acadyear, status, subjects, tracksubject, studentcategory } = req.body;

    try {

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
                    const subjectId = s.subject_id || s.id;
                    if (subjectId) {
                        const groupSubject = await GroupSubject.findOne({
                            where: { verify_id, subject_id: subjectId }
                        });
                        if (groupSubject) {
                            group_subject_id = groupSubject.id;
                        }
                    } else {
                        console.error('No valid subject ID found for group:', s);
                    }
                }

                if (type === 'subgroup') {
                    const subjectId = s.subject_id || s.id;
                    if (subjectId) {
                        const subGroupSubject = await SubgroupSubject.findOne({
                            where: { verify_id, subject_id: subjectId }
                        });
                        if (subGroupSubject) {
                            sub_group_subject_id = subGroupSubject.id;
                        }
                    } else {
                        console.error('No valid subject ID found for subgroup:', s);
                    }
                }

                if (type === 'semisubgroup') {
                    const subjectId = s.subject_id || s.id;  // Use s.id as fallback
                    if (subjectId) {  // Only proceed if we have a valid subject ID
                        const semiSubGroupSubject = await SemiSubgroupSubject.findOne({
                            where: { verify_id, subject_id: subjectId }
                        });
                        if (semiSubGroupSubject) {
                            semi_sub_group_subject_id = semiSubGroupSubject.id;
                        }
                    } else {
                        console.error('No valid subject ID found for semisubgroup:', s);
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

        const studentRecord = await Student.findOne({
            where: { stu_id: stu_id },
            include: {
                model: Teacher,
                as: 'Advisor', // Use the alias defined in your association
                attributes: ['id', 'user_id'], // Specify to return both id and user_id of the Teacher
            },
        });

        // Check if the student exists
        if (!studentRecord) {
            return res.status(404).json({
                ok: false,
                message: "Student not found."
            });
        }

        // Get the Teacher's user_id if available
        const userId = studentRecord?.Advisor ? studentRecord?.Advisor?.user_id : null;
        const stdfname = studentRecord?.first_name; 
        const stdlname = studentRecord?.last_name;
        const program = studentRecord?.program;
        const courses_type = studentRecord?.courses_type;

        if (userId) {
            await Notification.create({
                userId: userId, // Use the userId from Teacher
                text: `${stdfname} ${stdlname} ${program} ${courses_type} ส่งคำร้องขอตรวจสอบจบ`,
                destination: `/admin/verify-selection/${stu_id}`,
                isRead: false,
            });
        } else {
            console.error("No advisor found for this student.");
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

router.post("/again/:verify_id/:stu_id", isAuth, async (req, res) => {
    const { verify_id, stu_id } = req.params;
    const { term, cum_laude, acadyear, status, subjects, tracksubject, studentcategory } = req.body;

    try {
        if (!Array.isArray(subjects)) {
            return res.status(400).json({
                ok: false,
                message: "Subjects must be an array."
            });
        }

        const [sv, created] = await StudentVerify.upsert({
            verify_id, stu_id, term, cum_laude, acadyear, status
        });

        const svds = await StudentVerify.findOne({
            where: { verify_id, stu_id }
        });

        // Clear existing related records
        await StudentItVerifyGrade.destroy({ where: { stu_id } });
        await StudentVerifyApprovements.destroy({ where: { student_verify_id: svds.id } });
        await StudentVerifyDetail.destroy({ where: { student_verify_id: svds.id } });
        await StudentCategoryVerify.destroy({ where: { student_verify_id: svds.id } });


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
                    const subjectId = s.subject_id || s.id;
                    if (subjectId) {
                        const groupSubject = await GroupSubject.findOne({
                            where: { verify_id, subject_id: subjectId }
                        });
                        if (groupSubject) {
                            group_subject_id = groupSubject.id;
                        }
                    } else {
                        console.error('No valid subject ID found for group:', s);
                    }
                }

                if (type === 'subgroup') {
                    const subjectId = s.subject_id || s.id;
                    if (subjectId) {
                        const subGroupSubject = await SubgroupSubject.findOne({
                            where: { verify_id, subject_id: subjectId }
                        });
                        if (subGroupSubject) {
                            sub_group_subject_id = subGroupSubject.id;
                        }
                    } else {
                        console.error('No valid subject ID found for subgroup:', s);
                    }
                }

                if (type === 'semisubgroup') {
                    const subjectId = s.subject_id || s.id;  // Use s.id as fallback
                    if (subjectId) {  // Only proceed if we have a valid subject ID
                        const semiSubGroupSubject = await SemiSubgroupSubject.findOne({
                            where: { verify_id, subject_id: subjectId }
                        });
                        if (semiSubGroupSubject) {
                            semi_sub_group_subject_id = semiSubGroupSubject.id;
                        }
                    } else {
                        console.error('No valid subject ID found for semisubgroup:', s);
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

        for (const subtrack of tracksubject) {
            await StudentItVerifyGrade.create({
                stu_id: stu_id,
                subject_id: subtrack.subject_id,
                grade: subtrack.grade,
            });
        }

        const studentRecord = await Student.findOne({
            where: { stu_id: stu_id },
            include: {
                model: Teacher,
                as: 'Advisor', // Use the alias defined in your association
                attributes: ['id', 'user_id'], // Specify to return both id and user_id of the Teacher
            },
        });

        // Check if the student exists
        if (!studentRecord) {
            return res.status(404).json({
                ok: false,
                message: "Student not found."
            });
        }

        // Get the Teacher's user_id if available
        const userId = studentRecord?.Advisor ? studentRecord?.Advisor?.user_id : null;
        const stdfname = studentRecord?.first_name; 
        const stdlname = studentRecord?.last_name;
        const program = studentRecord?.program;
        const courses_type = studentRecord?.courses_type;

        if (userId) {
            await Notification.create({
                userId: userId, // Use the userId from Teacher
                text: `${stdfname} ${stdlname} ${program} ${courses_type} ส่งคำร้องขอตรวจสอบจบอีกครั้ง`,
                destination: `/admin/verify-selection/${stu_id}`,
                isRead: false,
            });
        } else {
            console.error("No advisor found for this student.");
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
