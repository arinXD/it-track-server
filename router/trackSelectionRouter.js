var express = require('express');
var router = express.Router();
const models = require('../models');
const TrackSelection = models.TrackSelection
const TrackSubject = models.TrackSubject
const Selection = models.Selection
const SelectionDetail = models.SelectionDetail
const Subject = models.Subject
const Student = models.Student
const Track = models.Track
const Enrollment = models.Enrollment

const { mailSender } = require('../controller/mailSender');
const { hostname } = require('../api/hostname');
const adminMiddleware = require("../middleware/adminMiddleware")
const { QueryTypes, Op } = require('sequelize');

const subjectAttr = ["subject_code", "title_th", "title_en", "credit"]

async function sendResultToEmail(stuid, result, acadyear) {
    const student = await Student.findOne({ where: { stu_id: stuid }, attributes: ["email"], })
    const track = await Track.findOne({ where: { track: result }, attributes: ["title_th", "title_en"], })
    const trackResult = track.dataValues
    const email = student.dataValues.email
    const htmlTemplate = `
    <h1>ประกาศผลการคัดเลือกแทรคของนักศึกษาปีการศึกษา ${acadyear}</h1>
    <p>แทรคของคุณคือ ${trackResult.title_en} (${result}) ${trackResult.title_th}</p>
    <p>ตรวจสอบข้อมูลได้ที่ <a href="${hostname}/student/tracks">${hostname}</a></p>`;
    const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: `ประกาศผลการคัดเลือกแทรคประจำปีการศึกษา ${acadyear}`,
        html: htmlTemplate
    }
    mailSender.sendMail(mailOption);
}

router.get("/", async (req, res) => {
    try {
        const data = await TrackSelection.findAll({
            include: [{
                model: Subject,
                attributes: subjectAttr,
            },],
            order: [
                ['acadyear', 'DESC'],
            ],
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

router.get("/:id", async (req, res) => {
    const id = req.params.id
    try {
        const data = await TrackSelection.findOne({
            where: {
                acadyear: id
            },
            include: [{
                model: Subject,
                attributes: subjectAttr,
            },],
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

function convertGrade(grade) {
    const grades = {
        "A": 4,
        "B+": 3.5,
        "B": 3,
        "C+": 2.5,
        "C": 2,
        "D+": 1.5,
        "D": 1,
        "F": 0,
    }
    return grades[grade] || null
}


// Cal GPA
const calculateGPA = (enrollments) => {
    let totalCredits = 0;
    let totalGradePoints = 0;

    for (const enrollment of enrollments) {
        const grade = enrollment?.dataValues?.grade
        const gradePoint = convertGrade(grade)
        if (gradePoint == null) {
            continue
        }
        const credit = enrollment?.dataValues?.Subject?.dataValues?.credit
        totalGradePoints += gradePoint * credit
        totalCredits += credit
    }

    if (totalCredits === 0) return 0;

    const gpa = totalGradePoints / totalCredits;
    return gpa;
};

router.get("/:acadyear/students", async (req, res) => {
    const acadyear = req.params.acadyear
    let data = []
    try {
        data = await TrackSelection.findOne({
            where: {
                acadyear,
            },
            attributes: ["id", "acadyear", "title"],
            include: [
                {
                    model: Selection,
                    attributes: ["id", "track_order_1", "track_order_2", "track_order_3", "result"],
                },
                {
                    model: Selection,
                    include: [
                        {
                            model: Student,
                            include: [
                                {
                                    model: Enrollment,
                                    attributes: ["subject_code", "grade"],
                                    include: [
                                        {
                                            model: Subject,
                                            attributes: ["credit"]
                                        }
                                    ]
                                }
                            ],
                            attributes: ["id", "stu_id", "email", "first_name", "last_name", "courses_type", "acadyear"],
                        },
                        {
                            model: SelectionDetail,
                            attributes: ["grade", "subject_code"],
                            include: [
                                {
                                    model: Subject,
                                    attributes: ["subject_code", "title_th", "title_en", "credit"]
                                }
                            ]
                        },
                    ]
                },
            ],
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: true,
            message: "Server error."
        })
    }

    const selections = data?.dataValues?.Selections
    if (selections?.length > 0) {
        for (const [index, selection] of selections.entries()) {
            const enrollments = selection?.dataValues?.Student?.dataValues?.Enrollments
            const selectionDetail = selection?.dataValues?.SelectionDetails
            selections[index].dataValues.gpa = calculateGPA(enrollments)
            selections[index].dataValues.score = calculateGPA(selectionDetail)

        }
    }
    if (data) {
        data.dataValues.Selections = selections
    }

    return res.status(200).json({
        ok: true,
        data
    })
})

router.get("/:acadyear/students/dashboard", async (req, res) => {
    const acadyear = req.params.acadyear
    let data = []
    try {
        data = await TrackSelection.findOne({
            where: {
                acadyear,
            },
            attributes: ["id", "acadyear", "title"],
            include: [
                {
                    model: Selection,
                    attributes: ["track_order_1", "track_order_2", "track_order_3", "result", "updatedAt"],
                    include: [
                        {
                            model: Student,
                            include: [
                                {
                                    model: Enrollment,
                                    attributes: ["subject_code", "grade"],
                                    include: [
                                        {
                                            model: Subject,
                                            attributes: ["credit"]
                                        }
                                    ]
                                }
                            ],
                            attributes: ["id", "stu_id", "email", "first_name", "last_name", "courses_type", "acadyear"],
                        },
                        {
                            model: SelectionDetail,
                            attributes: ["grade", "subject_code"],
                            include: [
                                {
                                    model: Subject,
                                    attributes: ["subject_code", "title_th", "title_en", "credit"]
                                }
                            ]
                        },
                    ]

                },
            ],
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: true,
            message: "Server error."
        })
    }

    const selections = data?.dataValues?.Selections
    let tracks = await Track.findAll()
    tracks = [...tracks?.map(e => e.dataValues.track), null]
    if (selections?.length > 0) {
        for (const [index, selection] of selections.entries()) {
            const enrollments = selection?.dataValues?.Student?.dataValues?.Enrollments
            const selectionDetail = selection?.dataValues?.SelectionDetails
            selections[index].dataValues.gpa = calculateGPA(enrollments)
            selections[index].dataValues.score = calculateGPA(selectionDetail)

            if (selection?.dataValues?.track_order_1 == null) {
                let randomNum = Math.floor(Math.random() * 10) + 1;
                const trackIndex = randomNum === 10 ? tracks.length - 1 : Math.floor(Math.random() * (tracks.length - 1));
                selections[index].dataValues.track_order_1 = tracks[trackIndex];
            }
        }
    }
    if (data) {
        data.dataValues.Selections = selections
    }

    return res.status(200).json({
        ok: true,
        data
    })
})

router.get("/:acadyear/popular", async (req, res) => {
    const acadyear = req.params.acadyear
    const pastFiveYears = acadyear - 4;
    let data = []
    try {
        data = await TrackSelection.findAll({
            where: {
                acadyear: {
                    [Op.between]: [pastFiveYears, acadyear + 1]
                }
            },
            limit: 5,
            order: [
                ['acadyear', 'asc'],
            ],
            attributes: ["acadyear"],
            include: [
                {
                    model: Selection,
                    attributes: ["track_order_1"],
                },
            ],
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: true,
            message: "Server error."
        })
    }
    let tracks = await Track.findAll()
    tracks = [...tracks?.map(e => e.dataValues.track)]
    for (const [i, ts] of data.entries()) {
        const selections = ts?.dataValues?.Selections || []
        for (const [index, select] of selections.entries()) {
            if (select?.dataValues?.track_order_1 == null) {
                const randomNum = Math.floor(Math.random() * tracks.length)
                selections[index].dataValues.track_order_1 = tracks[randomNum]
            }
        }
        data[i].dataValues.Selections = selections
    }

    return res.status(200).json({
        ok: true,
        data
    })
})

router.get("/:id/subjects", async (req, res) => {
    const id = req.params.id
    try {
        const data = await TrackSelection.findOne({
            where: {
                id
            },
            include: [{
                model: Subject,
                attributes: subjectAttr,
            },],
        })
        return res.status(200).json({
            ok: true,
            data: data.Subjects
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

router.get("/get/last", async (req, res) => {
    let data = []
    try {
        data = await TrackSelection.findOne({
            order: [
                ['acadyear', 'DESC'],
            ],
            attributes: ["id", "acadyear", "title"],
            include: [
                {
                    model: Selection,
                    attributes: ["track_order_1", "track_order_2", "track_order_3", "result", "updatedAt"],
                    include: [
                        {
                            model: Student,
                            include: [
                                {
                                    model: Enrollment,
                                    attributes: ["subject_code", "grade"],
                                    include: [
                                        {
                                            model: Subject,
                                            attributes: ["credit"]
                                        }
                                    ]
                                }
                            ],
                            attributes: ["id", "stu_id", "email", "first_name", "last_name", "courses_type", "acadyear"],
                        },
                        {
                            model: SelectionDetail,
                            attributes: ["grade", "subject_code"],
                            include: [
                                {
                                    model: Subject,
                                    attributes: ["subject_code", "title_th", "title_en", "credit"]
                                }
                            ]
                        },
                    ]

                },
            ],
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: true,
            message: "Server error."
        })
    }

    const selections = data?.dataValues?.Selections
    let tracks = await Track.findAll()
    tracks = [...tracks?.map(e => e.dataValues.track), null]
    if (selections?.length > 0) {
        for (const [index, selection] of selections.entries()) {
            const enrollments = selection?.dataValues?.Student?.dataValues?.Enrollments
            const selectionDetail = selection?.dataValues?.SelectionDetails
            selections[index].dataValues.gpa = calculateGPA(enrollments)
            selections[index].dataValues.score = calculateGPA(selectionDetail)
            delete selections[index].dataValues.Student
            delete selections[index].dataValues.SelectionDetails

            if (selection?.dataValues?.track_order_1 == null) {
                let randomNum = Math.floor(Math.random() * 10) + 1; // Generate random number between 1 and 10
                const trackIndex = randomNum === 10 ? tracks.length - 1 : Math.floor(Math.random() * (tracks.length - 1));
                selections[index].dataValues.track_order_1 = tracks[trackIndex];
            }
        }
    }
    if (data) {
        data.dataValues.Selections = selections
    }

    return res.status(200).json({
        ok: true,
        data
    })
})

router.get("/:id/subjects/students", async (req, res) => {
    const id = req.params.id
    try {
        const data = await TrackSelection.findOne({
            where: {
                acadyear: id
            },
            include: [{
                model: Subject,
                attributes: subjectAttr,
            },
            {
                model: Selection,
                include: [{
                    model: Student
                },
                {
                    model: SelectionDetail
                },
                ]
            },
            ],
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

// create
router.post("/", adminMiddleware, async (req, res) => {
    const {
        acadyear,
        title,
        startAt,
        expiredAt,
        trackSubj,
    } = req.body

    try {
        const ts = await TrackSelection.findOne({
            where: {
                acadyear
            }
        })

        if (!ts) {
            const newTsData = {
                acadyear,
                title,
                startAt,
                expiredAt,
            }
            const newTs = await TrackSelection.create(newTsData)
            for (const subj of trackSubj) {
                await TrackSubject.create({
                    track_selection_id: newTs.id,
                    subject_code: subj
                })
            }
            return res.status(201).json({
                ok: true,
                message: `เพิ่มการคัดแทรคปีการศึกษา ${acadyear} เรียบร้อย`
            })
        } else {
            return res.status(401).json({
                ok: false,
                message: `การคัดแทรคปีการศึกษา ${acadyear} ถูกเพิ่มไปแล้ว`
            })
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

//update
router.put("/:id", adminMiddleware, async (req, res) => {
    try {
        const id = req.params.id
        const trackSelectData = req.body

        await TrackSelection.update(trackSelectData, {
            where: {
                acadyear: id,
            },
        });

        return res.status(200).json({
            ok: true,
            message: `อัพเดตข้อมูลการคัดแทรคปีการศึกษา ${id} สำเร็จ`
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

// เปิด, ปิด การคัดแทรค
router.put('/selected/:id', adminMiddleware, async (req, res) => {

    async function calGrade(grades) {
        const gradeValues = {
            'A': 4.0,
            'B+': 3.5,
            'B': 3.0,
            'C+': 2.5,
            'C': 2.0,
            'D+': 1.5,
            'D': 1.0,
            'F': 0.0
        };
        const numericalGrades = grades.map(grade => gradeValues[grade]);
        const validNumericalGrades = numericalGrades.filter(val => val !== undefined);

        if (validNumericalGrades.length === 0) {
            return 0;
        }

        const sum = validNumericalGrades.reduce((acc, val) => acc + val, 0);
        const average = sum / validNumericalGrades.length;

        return parseFloat(average.toFixed(6));
    }

    function sortStudentData(firstSelect, secondSelect) {
        if (firstSelect.gpa !== secondSelect.gpa) {
            return secondSelect.gpa - firstSelect.gpa
        }
        return new Date(firstSelect.updatedAt) - new Date(secondSelect.updatedAt)
    }

    function getRandomTrack() {
        const tracks = ["BIT", "Network", "Web and Mobile"];
        const randomNumber = Math.floor(Math.random() * tracks.length);
        return tracks[randomNumber];
    }

    function getRandomTrack(skipTrack) {
        const tracks = ["BIT", "Network", "Web and Mobile"].filter(track => track !== skipTrack);
        const randomNumber = Math.floor(Math.random() * tracks.length);
        return tracks[randomNumber];
    }

    async function distributeTracks(stuData, courseType, trackCount, limit) {
        const selectionResult = stuData
        const trackOrder = [stuData.track_order_1, stuData.track_order_2, stuData.track_order_3]
        const countTrackOrder = trackOrder.filter(trackOrderElement => trackOrderElement).length

        // Who has not sign the form.
        if (countTrackOrder < 3) {
            let trackResult = selectionResult.result

            console.log(`${trackCount[courseType][trackResult]} >= ${limit[courseType]}: ${trackCount[courseType][trackResult] > limit[courseType]}`);

            if (trackCount[courseType][trackResult] >= limit[courseType]) {
                const oldTrack = [trackResult]
                while (true) {
                    const randomTrack = getRandomTrack();
                    if (!oldTrack.includes(randomTrack)) {
                        const trackLimit = limit[courseType];
                        const currentTrackCount = trackCount[courseType][randomTrack];
                        if (trackCount[courseType]["BIT"] === trackLimit &&
                            trackCount[courseType]["Network"] === trackLimit &&
                            trackCount[courseType]["Web and Mobile"] === trackLimit
                        ) {
                            trackCount[courseType][randomTrack] += 1;

                            console.log("3 Equal: ", randomTrack, trackCount[courseType][randomTrack]);
                            selectionResult.result = randomTrack
                            return selectionResult;
                        }
                        if (currentTrackCount <= trackLimit) {
                            trackCount[courseType][randomTrack] += 1;

                            console.log(randomTrack, trackCount[courseType][randomTrack]);
                            selectionResult.result = randomTrack
                            return selectionResult;
                        } else {
                            oldTrack.push(randomTrack)
                        }
                    }
                }
            }

            trackCount[courseType][trackResult] += 1

            console.log(trackResult, trackCount[courseType][trackResult]);
            return selectionResult
        }

        // Sign the form
        for (const track of trackOrder) {
            if (trackCount[courseType][track] < limit[courseType]) {
                selectionResult.result = track
                trackCount[courseType][track] += 1
                console.log(track, trackCount[courseType][track]);
                return selectionResult
            }
        }

        const randomTrack = getRandomTrack()
        selectionResult.result = randomTrack
        trackCount[courseType][randomTrack] += 1
        return selectionResult
    }

    function getRandomIndex(array) {
        const randomIndex = Math.floor(Math.random() * array.length);
        return randomIndex;
    }

    async function countStudents(program, acadyear, coursesType) {
        return await Student.count({
            where: {
                program,
                acadyear,
                courses_type: coursesType
            },
            distinct: true,
            col: 'id'
        });
    };

    try {
        let message
        const trackSelectId = req.params.id
        const trackSelection = await TrackSelection.findOne({
            where: {
                id: trackSelectId
            },
            include: [{
                model: Subject,
                attributes: subjectAttr,
            },
            {
                model: Selection,
                include: [{
                    model: Student
                },
                {
                    model: SelectionDetail
                },
                ]
            },
            ],
        })
        const acadyear = trackSelection?.dataValues?.acadyear
        const subjects = trackSelection?.dataValues?.Subjects?.map(subj => {
            return subj?.dataValues?.subject_code
        })

        // init limit 
        const totalNormalCount = await countStudents("IT", trackSelection.acadyear, "โครงการปกติ");
        const totalVipCount = await countStudents("IT", trackSelection.acadyear, "โครงการพิเศษ");
        const normalLimit = Math.floor(totalNormalCount / 3) || 1
        const vipLimit = Math.floor(totalVipCount / 3) || 1

        // set limit
        const limit = {
            normal: normalLimit,
            vip: vipLimit
        }

        // init counting track
        const trackCount = {
            normal: {
                "BIT": 0,
                "Network": 0,
                "Web and Mobile": 0
            },
            vip: {
                "BIT": 0,
                "Network": 0,
                "Web and Mobile": 0
            }
        }

        const typeMapping = {
            'โครงการพิเศษ': 'vip',
            'โครงการปกติ': 'normal',
        };

        // update convert status 
        await trackSelection.update({
            has_finished: !(trackSelection.has_finished)
        })
        await trackSelection.save()

        if (trackSelection.has_finished) {
            message = `ปิดการคัดเลือก`

            // get all student selection who sign the form
            const selections = trackSelection.dataValues.Selections
            if (selections.length > 0) {

                // classify student course
                const selectDataAll = {
                    normal: [],
                    vip: []
                }

                for (const selection of selections) {

                    // get student selection data detail
                    const value = selection.dataValues

                    // collect selection value
                    const selectData = {
                        id: value.id,
                        stu_id: value.stu_id,
                        track_order_1: value.track_order_1,
                        track_order_2: value.track_order_2,
                        track_order_3: value.track_order_3,
                        courses_type: typeMapping[value.Student.dataValues.courses_type],
                        result: value.result,
                        updatedAt: value.updatedAt,
                    }

                    // get grade from selection detail
                    const selectDetails = selection.dataValues.SelectionDetails
                    const grades = []
                    for (const selectDetail of selectDetails) {
                        const selectData = selectDetail.dataValues
                        grades.push(selectData.grade)
                    }

                    // calculate gpa
                    selectData.gpa = await calGrade(grades)
                    selectDataAll[selectData.courses_type].push(selectData)
                }

                // sort each course type
                Object.keys(selectDataAll).forEach(courseType => {
                    selectDataAll[courseType].sort(sortStudentData)
                })

                const mockupEmail = ["643020423-0", "643020405-2"]
                // Process
                for (let courseType of Object.keys(selectDataAll)) {
                    for (const stuData of selectDataAll[courseType]) {
                        const selectionResult = await distributeTracks(stuData, courseType, trackCount, limit)

                        // update track selection result
                        await Selection.update({
                            result: selectionResult.result
                        }, {
                            where: {
                                id: selectionResult.id,
                            },
                        });

                        if (mockupEmail.includes(selectionResult.stu_id)) {
                            sendResultToEmail(selectionResult.stu_id, selectionResult.result, acadyear)
                        }
                    }
                }
            } // scope if selections.length > 0 

            // students who haven't sign the form
            let studentsIT = await models.sequelize.query(`
            SELECT Students.stu_id, Students.courses_type
            FROM Students LEFT JOIN Selections
            ON Students.stu_id = Selections.stu_id
            WHERE Selections.stu_id IS NULL
            AND Students.acadyear = ${trackSelection.acadyear}
            AND Students.program = 'IT'
            AND Students.status_code = 10`, {
                type: QueryTypes.SELECT
            });

            if (studentsIT.length > 0) {
                // sort student data by student id
                studentsIT.sort((firstStudentRecord, secondStudentRecord) => firstStudentRecord.stu_id.localeCompare(secondStudentRecord.stu_id));

                const courseTypeStudents = {
                    normal: [],
                    vip: []
                }

                studentsIT.forEach(student => {
                    const courseType = typeMapping[student.courses_type]
                    courseTypeStudents[courseType].push(student.stu_id)
                })

                async function createSelection(insertSelectionData) {
                    const mockupEmail = ["643020423-0", "643020405-2"]
                    const stuid = insertSelectionData.stu_id
                    const selection = await Selection.create(insertSelectionData)
                    if (mockupEmail.includes(stuid)) {
                        sendResultToEmail(stuid, insertSelectionData.result, acadyear)
                    }
                    const sid = selection.dataValues.id
                    for (const subj of subjects) {
                        const enrollment = await Enrollment.findOne({
                            where: {
                                stu_id: stuid,
                                subject_code: subj
                            },
                            attributes: ["grade"],
                        })
                        const grade = enrollment?.dataValues?.grade || null
                        await SelectionDetail.create({
                            selection_id: sid,
                            subject_code: subj,
                            grade: grade
                        })
                    }
                }

                // Process
                for (const courseType of Object.keys(courseTypeStudents)) {
                    const tracks = ["BIT", "Network", "Web and Mobile"]
                    const studentIDArray = courseTypeStudents[courseType];

                    while (studentIDArray.length > 0) {
                        // 3 loop
                        for (const track of tracks) {
                            if (studentIDArray.length === 0) {
                                break;
                            }

                            if (trackCount[courseType][track] === limit[courseType]) {
                                const trackIndex = tracks.indexOf(track)
                                tracks.splice(trackIndex, 1);
                                continue
                            }

                            const randomIndex = getRandomIndex(studentIDArray);
                            const studentId = studentIDArray[randomIndex];

                            const insertSelectionData = {
                                track_selection_id: trackSelectId,
                                stu_id: studentId,
                                result: track
                            };

                            // create track selection
                            await createSelection(insertSelectionData);
                            trackCount[courseType][track] += 1
                            console.log(track, trackCount[courseType][track]);
                            // decrease length of array 
                            studentIDArray.splice(randomIndex, 1);
                        }

                        if (studentIDArray.length === 0) {
                            break;
                        }
                        if (tracks.length === 0) {
                            const randomIndex = getRandomIndex(studentIDArray);
                            const studentId = studentIDArray[randomIndex];
                            let randomTrack
                            while (true) {
                                randomTrack = getRandomTrack()
                                const trackCountsArray = Object.values(trackCount[courseType]);
                                const minValue = Math.min(...trackCountsArray);
                                if (trackCount[courseType][randomTrack] === minValue) {
                                    break
                                }
                            }
                            console.log("randomTrack: ", randomTrack);
                            const insertSelectionData = {
                                track_selection_id: trackSelectId,
                                stu_id: studentId,
                                result: randomTrack
                            };

                            // create track selection
                            await createSelection(insertSelectionData);
                            trackCount[courseType][randomTrack] += 1
                            // decrease length of array 
                            studentIDArray.splice(randomIndex, 1);
                        }

                    }
                    console.log();
                }

            } // unsign length > 0
            console.log(limit);
            console.log(trackCount);
        } else {
            message = `เปิดการคัดเลือก`
        }

        return res.status(200).json({
            ok: true,
            message
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

// del
router.delete("/:id", adminMiddleware, async (req, res) => {
    const id = req.params.id
    try {
        await TrackSelection.destroy({
            where: {
                acadyear: id
            },
            force: true
        });
        return res.status(200).json({
            ok: true,
            message: `ลบการคัดแทรคปีการศึกษา ${id} เรียบร้อย`
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

router.delete('/del/selected', adminMiddleware, async (req, res) => {
    const {
        acadArr
    } = req.body
    try {
        let delAcad = []
        for (const acadyear of acadArr) {
            delAcad.push(acadyear)
            await TrackSelection.destroy({
                where: {
                    acadyear: acadyear
                },
                force: true
            });
        }
        if (delAcad.length == 0) {
            return res.status(200).json({
                ok: true,
                message: "ไม่มีการคัดแทรคที่ถูกลบ"
            })
        } else {
            return res.status(200).json({
                ok: true,
                message: `ลบการคัดแทรคปีการศึกษา ${delAcad.join(", ")} เรียบร้อย`
            })
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
})

module.exports = router