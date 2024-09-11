const express = require('express');
const router = express.Router();
const models = require('../models');
const Student = models.Student
const Teacher = models.Teacher
const Selection = models.Selection
const SelectionDetail = models.SelectionDetail
const Program = models.Program
const User = models.User
const StudentStatus = models.StudentStatus
const Enrollment = models.Enrollment
const Subject = models.Subject
const Track = models.Track
const adminMiddleware = require("../middleware/adminMiddleware");
const { Op } = require('sequelize');
const { findSubjectByCode } = require('../utils/subject');
const isAuth = require('../middleware/authMiddleware');
const validateStudent = require('../middleware/validateStudent');
const { sleep } = require('../utils/sleep');

router.get("/:stuid", validateStudent, async (req, res) => {
    const stuid = req.params.stuid
    try {
        const students = await Student.findOne({
            where: {
                stu_id: stuid
            },
            include: [{
                model: Program,
            },
            {
                model: User,
            },
            {
                model: StudentStatus,
            },
            {
                model: Enrollment,
                include: [{
                    model: Subject,
                },]
            },
            ],
        })
        return res.status(200).json({
            ok: true,
            data: students
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

router.get("/:stuid/track/select", validateStudent, async (req, res) => {
    const stu_id = req.params.stuid
    try {
        const select = await Selection.findOne({
            where: {
                stu_id
            },
            include: [{
                model: Track,
            },],
        })
        return res.status(200).json({
            ok: true,
            data: select
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

router.get("/:stuid/track/select/detail", validateStudent, async (req, res) => {
    const stu_id = req.params.stuid
    try {
        const select = await Selection.findOne({
            where: {
                stu_id
            },
            include: [{
                model: SelectionDetail,
            },],
        })
        const selectionDetailId = []
        if (select) {
            const subjects = select.SelectionDetails
            for (const subject of subjects) {
                selectionDetailId.push(subject.dataValues.id)
            }
        }
        return res.status(200).json({
            ok: true,
            data: select
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

router.post("/track/select", isAuth, async (req, res) => {
    const {
        track_selection_id,
        stu_id,
        track_order_1,
        track_order_2,
        track_order_3,
        subjectsData
    } = req.body

    let selectData = {
        track_selection_id,
        stu_id,
        track_order_1,
        track_order_2,
        track_order_3,
    }
    const selectionDetailId = []
    try {
        let selectId = await Selection.findOne({
            where: {
                stu_id
            },
            include: [{
                model: SelectionDetail,
            },],
        })
        if (selectId) {
            selectData.id = selectId.id
            const subjects = selectId.SelectionDetails
            for (const subject of subjects) {
                selectionDetailId.push(subject.dataValues.id)
            }
        }
        let userSelection = await Selection.upsert(selectData)
        for (const index in subjectsData) {
            let selectDetail = subjectsData[index]
            selectDetail.subject_id = await findSubjectByCode(selectDetail.subject_code)
            if (selectId) {
                selectDetail.id = selectionDetailId[index]
                selectDetail.selection_id = selectId.id
            } else {
                selectDetail.selection_id = userSelection[0].dataValues.id
            }
            await SelectionDetail.upsert(selectDetail)
        }
        let resultData
        if (selectId) {
            resultData = selectId.dataValues
        } else {
            resultData = userSelection[0].dataValues
            resultData.createdAt = new Date()
            resultData.updatedAt = new Date()
        }

        return res.status(201).json({
            ok: true,
            data: resultData,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

// ----------------------------------
// Admin 
// ----------------------------------

router.get("/", adminMiddleware, async (req, res) => {
    try {
        const students = await Student.findAll({
            limit: 2
        })
        return res.status(200).json({
            ok: true,
            data: students
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

router.get("/get/restores", adminMiddleware, async (req, res) => {
    try {
        const students = await Student.findAll({
            paranoid: false,
            where: {
                daletedAt: {
                    [Op.not]: null
                }
            },
            include: [{
                model: Program,
            },
            {
                model: StudentStatus,
            },
            {
                model: User,
            },
            ],
        })
        return res.status(200).json({
            ok: true,
            data: students
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

router.get("/find/:student", adminMiddleware, async (req, res) => {
    const student = req.params.student
    try {
        const students = await Student.findAll({
            where: {
                [Op.or]: [
                    { first_name: { [Op.like]: `%${student}%` } },
                    { last_name: { [Op.like]: `%${student}%` } },
                    { stu_id: { [Op.like]: `%${student}%` }, }
                ]
            },
            include: [{
                model: Program,
            },
            ],
        })
        return res.status(200).json({
            ok: true,
            data: students
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

router.put("/:id/restore", adminMiddleware, async (req, res) => {
    const stu_id = req.params.id
    try {
        await Student.restore({
            where: {
                stu_id
            }
        });
        return res.status(200).json({
            ok: true,
            message: "กู้คืนข้อมูลสำเร็จ"
        })
    } catch (error) {
        return res.status(200).json({
            ok: false,
            message: "กู้คืนข้อมูลไม่สำเร็จ"
        })
    }
})

router.put("/restore/select", adminMiddleware, async (req, res) => {
    const {
        students
    } = req.body
    try {
        for (const id of students) {
            await Student.restore({
                where: {
                    id
                }
            });

        }
        return res.status(200).json({
            ok: true,
            message: "กู้คืนข้อมูลสำเร็จ"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

router.put("/:id", adminMiddleware, async (req, res) => {
    const stuid = req.params.id
    const stuData = req.body
    try {
        await Student.update(stuData, {
            where: {
                stu_id: stuid
            },
        });
        return res.status(200).json({
            ok: true,
            message: "แก้ไขข้อมูลสำเร็จ"
        })
    } catch (error) {
        let field = "";

        if (error.errors && error.errors.length > 0) {
            field = error.errors[0].path;
            field = field === "stu_id" ? "รหัสนักศึกษา" : field === "email" ? "อีเมล" : field;
        }

        return res.status(401).json({
            ok: false,
            message: `${field} ถูกเพิ่มไปแล้ว`
        });
    }
})

router.post("/", adminMiddleware, async (req, res) => {
    const studentData = req.body
    try {
        await Student.create(studentData)
        return res.status(200).json({
            ok: true,
            message: "เพิ่มนักศึกษาสำเร็จ"
        })
    } catch (error) {
        ok = false
        let field = error.errors.map(e => e.path)
        field = field == "stu_id" ? "รหัสนักศึกษา" : field == "email" ? "อีเมล" : field
        return res.status(401).json({
            ok: false,
            message: `${field} ถูกเพิ่มไปแล้ว`
        })
    }
})

router.post("/excel", adminMiddleware, async (req, res) => {
    async function bulkUpsertStudents(arr) {
        for (let index = 0; index < arr.length; index++) {
            // studentcode
            // studentname
            // kkumail
            // program
            function getAcadYearFromStdID(studentCode) {
                const currentYear = ((new Date().getFullYear()) + 543).toString();
                const firstTwoDigits = currentYear.slice(0, 2);
                const acadyear = `${firstTwoDigits}${studentCode.slice(0, 2)}`
                return parseInt(acadyear)
            }

            const studentData = arr[index];
            const stu_id = studentData.studentcode
            const email = studentData.kkumail
            const titleRegex = /^(นาย|นาง|นางสาว)?\s*/;
            const name = studentData?.studentname.replace(titleRegex, '').trim()
            const [first_name, ...last_name] = name?.split(" ")
            const program = String(studentData?.program?.split("-")[1]).toUpperCase()

            const findStudent = await Student.findOne({
                where: {
                    email: email
                }
            });

            let upsertData = {}
            if (findStudent) {
                upsertData = {
                    id: findStudent?.dataValues?.id,
                    first_name: first_name,
                    last_name: [...last_name].join(" "),
                    program: program,
                }
                await Student.update(upsertData, {
                    where: { email: email }
                })
            } else {
                upsertData = {
                    stu_id: stu_id,
                    email: email,
                    first_name: first_name,
                    last_name: [...last_name].join(" "),
                    courses_type: "โครงการปกติ",
                    program: program,
                    acadyear: getAcadYearFromStdID(stu_id),
                    status_code: 10,
                }
                await Student.create(upsertData)
            }
        }
    }

    const data = req.body
    const students = data.filter(row => {
        if (
            row["studentcode"] != null &&
            row["studentname"] != null &&
            row["kkumail"] != null &&
            row["program"] != null
        ) {
            return row
        }
    })
    try {
        bulkUpsertStudents(students)
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
    return res.status(200).json({
        ok: true,
        message: "เพิ่มข้อมูลสำเร็จ"
    })
})

router.post("/enrollments/excel", adminMiddleware, async (req, res) => {

    async function bulkUpsertEnrollments(enrollments) {
        for (let index = 0; index < enrollments.length; index++) {
            const enrollData = enrollments[index];
            try {
                // 1.หาหลักสูตร
                // 2.หาอาจารย์
                // 3.หานักศึกษา
                // 4.หาวิชา
                // 5.หาเกรด

                // 1.หาหลักสูตร
                // programname
                function getCoursesType(program) {
                    const regex = /[()]/g;
                    let type
                    try {
                        type = program.split(" ")[1];
                        if (type) {
                            type = type.replace(regex, "");
                        } else {
                            type = "โครงการปกติ"
                        }
                    } catch (error) {
                        type = ""
                    }
                    return type || "โครงการปกติ";
                }
                const rawProgram = enrollData.programname.split(" ")[0]
                const findProgram = await Program.findOne({ where: { title_th: rawProgram } })
                const program = findProgram ? findProgram?.dataValues?.program : "IT"
                const coursesType = getCoursesType(enrollData.programname)

                // 2.หาอาจารย์
                // prefixname
                // officername
                // officersurname
                // officermail
                let advisor = {}
                const { prefixname, officername, officersurname, officeremail } = enrollData
                if (officeremail) {
                    const findAdvisor = await Teacher.findOne({ where: { email: officeremail } })
                    if (findAdvisor) {
                        advisor = findAdvisor?.dataValues
                    } else {
                        const newAdvisor = await Teacher.create({
                            email: officeremail,
                            prefix: prefixname,
                            name: officername,
                            surname: officersurname
                        })
                        advisor = newAdvisor?.dataValues
                    }
                }

                // 3.หานักศึกษา
                // นักศึกษา
                // "studentcode"] != null
                // "studentname"] != null
                // "studentsurname"] != null
                // "kkumail"] != null
                // studentstatus
                function getAcadYear(studentCode) {
                    const currentYear = ((new Date().getFullYear()) + 543).toString();
                    const firstTwoDigits = currentYear.slice(0, 2);
                    const acadyear = `${firstTwoDigits}${studentCode.slice(0, 2)}`
                    return parseInt(acadyear)
                }
                const findStudent = await Student.findOne({
                    where: { email: enrollData.kkumail }
                })
                let studentData = {}
                if (findStudent) {
                    studentData = {
                        id: findStudent?.dataValues?.id,
                        stu_id: findStudent?.dataValues?.stu_id,
                        first_name: enrollData.studentname,
                        last_name: enrollData.studentsurname,
                        courses_type: coursesType,
                        program: program,
                        acadyear: getAcadYear(enrollData.studentcode),
                        status_code: enrollData?.studentstatus ?? 10,
                        advisor: advisor?.id,
                    }

                    await Student.update(studentData, {
                        where: { id: findStudent?.id }
                    })
                } else {
                    const createData = {
                        stu_id: enrollData.studentcode,
                        email: enrollData.kkumail,
                        first_name: enrollData.studentname,
                        last_name: enrollData.studentsurname,
                        courses_type: coursesType,
                        program: program,
                        acadyear: getAcadYear(enrollData.studentcode),
                        status_code: enrollData?.studentstatus || 10,
                        advisor: advisor.id
                    }
                    const newStudent = await Student.create(createData);
                    studentData = newStudent?.dataValues
                }

                // 4.หาวิชา
                // coursecode
                // coursename
                // coursenameeng
                // credittotal
                const subjectId = await findSubjectByCode(enrollData?.coursecode)
                let subjectData = {}
                if (subjectId) {
                    subjectData = {
                        title_th: enrollData?.coursename,
                        title_en: enrollData?.coursenameeng,
                        credit: enrollData?.credittotal || 1
                    }
                    await Subject.update(subjectData, {
                        where: { subject_id: subjectId }
                    })
                    subjectData.subject_id = subjectId
                } else {
                    const createData = {
                        subject_code: enrollData.coursecode,
                        title_th: enrollData?.coursename,
                        title_en: enrollData?.coursenameeng,
                        credit: enrollData?.credittotal || 1
                    }
                    const newSubject = await Subject.create(createData)
                    subjectData = newSubject?.dataValues
                }

                // 5.หาเกรด (ต้องการ ID student, subject) studentData, subjectData
                // gradeentry2
                // acadyear
                let upsertEnrollData = {
                    stu_id: studentData.stu_id,
                    subject_id: subjectData.subject_id,
                    enroll_year: enrollData?.acadyear,
                    grade: enrollData?.gradeentry2
                }
                const findEnroll = await Enrollment.findOne({
                    where: {
                        stu_id: studentData.stu_id,
                        subject_id: subjectData.subject_id,
                        enroll_year: enrollData?.acadyear
                    }
                });
                if (findEnroll) {
                    upsertEnrollData.id = findEnroll?.dataValues?.id
                }
                await Enrollment.upsert(upsertEnrollData);
            } catch (error) {
                console.error(error);
                return
            }
        }
    }

    let enrollments = req.body
    enrollments = enrollments.filter(row => {
        if (
            // หลักสูตร
            row["programname"] != null &&
            // นักศึกษา
            row["studentcode"] != null &&
            row["studentname"] != null &&
            row["studentsurname"] != null &&
            row["kkumail"] != null &&
            // วิชา
            row["coursecode"] != null &&
            row["coursename"] != null &&
            row["coursenameeng"] != null &&
            row["credittotal"] != null &&
            row["acadyear"] != null
        ) return row
    })
    try {
        bulkUpsertEnrollments(enrollments)
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
    return res.status(200).json({
        ok: true,
        message: "เพิ่มข้อมูลสำเร็จ"
    })
})

router.delete("/:id", adminMiddleware, async (req, res) => {
    const stu_id = req.params.id
    try {
        await Student.destroy({
            where: {
                stu_id
            }
        })
        return res.status(200).json({
            ok: true,
            message: "ลบข้อมูลนักศึกษาสำเร็จ"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})
router.delete("/:id/force", adminMiddleware, async (req, res) => {
    const stu_id = req.params.id
    try {
        await Student.destroy({
            where: {
                stu_id
            },
            force: true
        })
        return res.status(200).json({
            ok: true,
            message: "ลบข้อมูลนักศึกษาสำเร็จ"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "ข้อมูลอื่นได้รับผลกระทบจาการลบ ไม่สามารถลบได้"
        })
    }
})

router.delete("/multiple/delete", adminMiddleware, async (req, res) => {
    const {
        students
    } = req.body
    try {
        for (const id of students) {
            await Student.destroy({
                where: {
                    id
                }
            })
        }
        return res.status(200).json({
            ok: true,
            message: "ลบข้อมูลนักศึกษาสำเร็จ"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})
router.delete("/multiple/delete/force", adminMiddleware, async (req, res) => {
    const { students } = req.body
    try {
        for (const id of students) {
            await Student.destroy({
                where: {
                    id
                },
                force: true
            })
        }
        return res.status(200).json({
            ok: true,
            message: "ลบข้อมูลนักศึกษาสำเร็จ"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

router.get("/programs/:pid/acadyear/:acad", adminMiddleware, async (req, res) => {
    const pid = req.params.pid
    const acad = req.params.acad

    if (!pid && !acad) {
        return res.status(400).json({
            ok: false,
            message: "Provide program id or academic year."
        })
    }
    if (!Number.isInteger(parseInt(acad))) {
        return res.status(400).json({
            ok: false,
            message: "Academic year must be integer."
        })
    }

    try {
        const students = await Student.findAll({
            where: {
                acadyear: acad
            },
            include: [{
                model: Program,
                where: {
                    program: pid
                }
            },
            {
                model: StudentStatus,
            },
            {
                model: User,
            },
            ],
        })
        return res.status(200).json({
            ok: true,
            data: students
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

router.get("/programs/:pid/acadyear/:acad/advisor/:email", adminMiddleware, async (req, res) => {
    const { pid, acad, email } = req.params;

    if (!pid || !acad || !email) {
        return res.status(400).json({
            ok: false,
            message: "Provide program id, academic year, and email."
        });
    }

    const isAllPrograms = pid.toLowerCase() === 'all';

    if (!isAllPrograms && !Number.isInteger(parseInt(acad))) {
        return res.status(400).json({
            ok: false,
            message: "Academic year must be integer when a specific program is selected."
        });
    }

    try {
        const whereClause = {};
        if (!isAllPrograms) {
            whereClause.acadyear = acad;
        }

        const includeClause = [
            {
                model: Program,
                where: isAllPrograms ? {} : { program: pid }
            },
            {
                model: StudentStatus,
            },
            {
                model: User,
            },
            {
                model: Teacher,
                where: { email }
            },
        ];

        const students = await Student.findAll({
            where: whereClause,
            include: includeClause,
        });

        return res.status(200).json({
            ok: true,
            data: students
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        });
    }
});

module.exports = router