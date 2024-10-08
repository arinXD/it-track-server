const fs = require('fs');
const csv = require('csv-parser');

const { QueryTypes, Op } = require('sequelize');
const models = require('../models');
const TrackSelection = models.TrackSelection
const TrackSubject = models.TrackSubject
const Selection = models.Selection
const SelectionDetail = models.SelectionDetail
const Subject = models.Subject
const Student = models.Student
const Track = models.Track
const Enrollment = models.Enrollment
const StudentStatus = models.StudentStatus
const News = models.News

const { mailSender } = require('../controller/mailSender');
const { hostname, getHostname } = require('../api/hostname');
const { findSubjectByCode } = require('../utils/subject');
const { simpleDMY } = require('../utils/simpleDateFormatter');

const subjectAttr = ["subject_code", "title_th", "title_en", "credit"]

async function sendResultToEmail(stuid, result, acadyear) {
    const student = await Student.findOne({ where: { stu_id: stuid }, attributes: ["email"], })
    const track = await Track.findOne({ where: { track: result }, attributes: ["title_th", "title_en"], })
    const trackResult = track.dataValues
    const email = student.dataValues.email
    const htmlTemplate = `
    <h1>ประกาศผลการคัดเลือกแทร็กของนักศึกษาปีการศึกษา ${acadyear}</h1>
    <p>แทร็กของคุณคือ ${trackResult.title_en} (${result}) ${trackResult.title_th}</p>
    <p>ตรวจสอบข้อมูลได้ที่ <a href="${hostname}/student/tracks">${hostname}</a></p>`;
    const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: `ประกาศผลการคัดเลือกแทร็กประจำปีการศึกษา ${acadyear}`,
        html: htmlTemplate
    }
    try {
        mailSender.sendMail(mailOption);
    } catch (error) {
        console.log(error);
    }
}

const sendEmailToStudent = async (req, res) => {
    const acadyear = req.params.acadyear
    try {
        const selections = await Selection.findAll({
            include: [
                {
                    model: Student,
                    where: {
                        acadyear
                    },
                },
            ]
        })
        const mockupEmail = ["643020423-0"];
        const emailPromises = selections
            .filter(selection => mockupEmail.includes(selection.dataValues.stu_id))
            .map(selection => sendResultToEmail(selection.dataValues.stu_id, selection.dataValues.result, acadyear));

        await Promise.all(emailPromises);

        return res.status(200).json({
            ok: true,
            message: "ส่งอีเมลสำเร็จ"
        })
    } catch (error) {
        console.error("Error in sendEmailToStudent:", error);
        return res.status(500).json({
            ok: false,
            message: "Server error.",
            error: error.message
        });
    }
}

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

const testSelection = async (req, res) => {
    fs.createReadStream('./csv/student_selection.csv')
        .pipe(csv())
        .on('data', async (data) => {
            const ts = await TrackSelection.findOne({ where: { acadyear: 2565 } })
            const select = await Selection.create({
                track_selection_id: ts.dataValues.id,
                stu_id: data.stuid,
                track_order_1: data.OR01,
                track_order_2: data.OR02,
                track_order_3: data.OR03
            })
            const sid = select.dataValues.id
            const subjs = ["SC361002", "SC361003", "SC361004", "SC361005",]
            for (const subj of subjs) {
                const subjId = await findSubjectByCode(subj)
                await SelectionDetail.create({
                    selection_id: sid,
                    subject_id: subjId,
                    grade: data[subj],
                })
            }
        })
        .on('end', () => console.log("end"))

    return res.json({
        message: "Test"
    })
}

const getAllTrackSelections = async (req, res) => {
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
}

const getTrackSelections = async (req, res) => {
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
}

const getStudentInTrackSelection = async (req, res) => {
    const acadyear = req.params.acadyear
    let data = []
    try {
        data = await TrackSelection.findOne({
            where: {
                acadyear,
            },
            attributes: ["acadyear", "title"],
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
                                    attributes: ["subject_id", "grade"],
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
                            attributes: ["grade", "subject_id"],
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
}

const getDashboardData = async (req, res) => {
    const courseTypes = { "โครงการปกติ": "regular", "โครงการพิเศษ": "special" }
    const acadyear = req.params.acadyear
    try {
        const data = await TrackSelection.findOne({
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
                                    attributes: ["subject_id", "grade"],
                                    include: [
                                        {
                                            model: Subject,
                                            attributes: ["credit"]
                                        }
                                    ]
                                }
                            ],
                            attributes: ["stu_id", "email", "first_name", "last_name", "courses_type", "acadyear"],
                        },
                        {
                            model: SelectionDetail,
                            attributes: ["grade", "subject_id"],
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
        const selections = data?.dataValues?.Selections
        let tracks = await Track.findAll()
        tracks = [...tracks?.map(e => e.dataValues.track)]
        if (selections?.length > 0) {
            for (const [index, selection] of selections.entries()) {
                const enrollments = selection?.dataValues?.Student?.dataValues?.Enrollments
                const selectionDetail = selection?.dataValues?.SelectionDetails
                selections[index].dataValues.gpa = calculateGPA(enrollments)
                selections[index].dataValues.score = calculateGPA(selectionDetail)
                selections[index].dataValues.courseType = courseTypes[data.dataValues.Selections[index].dataValues.Student?.dataValues?.courses_type]
                selections[index].dataValues.stuId = data.dataValues.Selections[index].dataValues.Student?.dataValues?.stu_id
                selections[index].dataValues.stuName = data.dataValues.Selections[index].dataValues.Student?.dataValues?.first_name + " " + data.dataValues.Selections[index].dataValues.Student?.dataValues?.last_name
                delete data.dataValues.Selections[index].dataValues.Student
                delete data.dataValues.Selections[index].dataValues.SelectionDetails
            }
        }
        if (data) {
            data.dataValues.Selections = selections
            const result = [
                { type: "all", data: [] },
                { type: "regular", data: [] },
                { type: "special", data: [] },
            ];
            const popularity = [
                { type: "all", data: [] },
                { type: "regular", data: [] },
                { type: "special", data: [] },
            ]
            const selectedCount = {
                selected: [],
                nonSelected: [],
            }
            data.dataValues.Selections.forEach(selection => {
                // หาเกรดเฉลี่ยรวมและจำนวนนักศึกษาในแทร็ก
                const sl = selection?.dataValues;
                const resultData = result.find(resultType => resultType.type == sl.courseType).data
                let rs = resultData.find(item => item.track === sl.result);
                let rsTotal = result[0].data.find(item => item.track === sl.result);
                if (!rs) {
                    rs = {
                        track: sl.result,
                        total: 1,
                        gpaSum: sl.gpa,
                        gpaAvg: sl.gpa
                    };
                    resultData.push(rs)
                } else {
                    rs.total += 1;
                    rs.gpaSum += sl.gpa;
                    rs.gpaAvg = rs.gpaSum / rs.total;
                }
                if (!rsTotal) {
                    rsTotal = {
                        track: sl.result,
                        total: 1,
                        gpaSum: sl.gpa,
                        gpaAvg: sl.gpa
                    };
                    result[0].data.push(rsTotal)
                } else {
                    rsTotal.total += 1;
                    rsTotal.gpaSum += sl.gpa;
                    rsTotal.gpaAvg = rsTotal.gpaSum / rsTotal.total;
                }

                // หาแทร็กที่ถูกเลือกเยอะที่สุด
                const popData = popularity.find(popType => popType.type == sl.courseType).data
                let pop = popData.find(item => item.track === sl.track_order_1);
                let popTotal = popularity[0].data.find(item => item.track === sl.track_order_1);
                if (!pop) {
                    pop = {
                        track: sl.track_order_1,
                        selected: 1
                    }
                    popData.push(pop)
                } else {
                    pop.selected += 1
                }
                if (!popTotal) {
                    popTotal = {
                        track: sl.track_order_1,
                        selected: 1
                    }
                    popularity[0].data.push(popTotal)
                } else {
                    popTotal.selected += 1
                }

                // หาคนที่มาคัดและไม่ได้มาคัด
                if (sl.track_order_1 !== null) {
                    selectedCount.selected.push(sl)
                } else {
                    selectedCount.nonSelected.push(sl)
                }
                delete sl.updatedAt
                delete sl.gpa
                delete sl.score
            });

            delete data.dataValues.Selections

            data.dataValues.result = result.sort((a, b) => (b.gpaAvg - a.gpaAvg))
            data.dataValues.popularity = popularity
            data.dataValues.selectedCount = selectedCount
        }


        return res.status(200).json({
            ok: true,
            data
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: true,
            message: "Server error."
        })
    }
}

const getMostPopularTrack = async (req, res) => {
    const start = parseInt(req.params.start, 10);
    const end = parseInt(req.params.end, 10);
    if (isNaN(start) || isNaN(end)) {
        return res.status(406).json({
            ok: false,
            message: "acadyear must be a number."
        });
    }

    try {
        const data = await TrackSelection.findAll({
            where: {
                acadyear: {
                    [Op.between]: [start, end]
                }
            },
            order: [
                ['acadyear', 'asc'],
            ],
            attributes: ["acadyear"],
            include: [
                {
                    model: Selection,
                    attributes: ["track_order_1"],
                    include: [
                        {
                            model: Student,
                            attributes: ["courses_type"]
                        }
                    ]
                },
            ],
        })
        const courseTypes = { "โครงการปกติ": "regular", "โครงการพิเศษ": "special" }
        for (let index = 0; index < data.length; index++) {
            const result = [
                { type: "regular", data: [] },
                { type: "special", data: [] },
            ];
            const selection = data[index]?.dataValues?.Selections;
            for (let j = 0; j < selection.length; j++) {
                const sl = selection[j]?.dataValues
                const track = sl?.track_order_1;
                const coursesType = courseTypes[sl?.Student?.dataValues?.courses_type]
                const resultData = result.find(rsData => rsData.type == coursesType).data
                let rs = resultData.find(item => item.track === track);
                if (!rs) {
                    rs = {
                        track: track,
                        count: 1
                    }
                    resultData.push(rs)
                } else {
                    rs.count += 1
                }
            }
            data[index].dataValues.result = result
            delete data[index].dataValues.Selections
        }
        const filteredData = data.filter(yearData => {
            return yearData?.dataValues?.result.some(result => result?.data?.length > 0);
        });

        return res.status(200).json({
            ok: true,
            data: filteredData
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: true,
            message: "Server error."
        })
    }
}

const getSubjectInTrackSelection = async (req, res) => {
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
}

const getLastest = async (req, res) => {
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
                                    attributes: ["subject_id", "grade"],
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
                            attributes: ["grade", "subject_id"],
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
}

const getStudentAndSubject = async (req, res) => {
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
                    model: SelectionDetail,
                    include: [{
                        model: Subject
                    },]
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
}

const createTrackSelection = async (req, res) => {
    const { acadyear, title, startAt, expiredAt, announcementDate, trackSubj, } = req.body
    try {
        const ts = await TrackSelection.findOne({
            where: { acadyear }
        })

        if (!ts) {
            const newTsData = {
                acadyear,
                title,
                startAt,
                expiredAt,
                announcementDate
            }
            const newTs = await TrackSelection.create(newTsData)
            for (const subj of trackSubj) {
                const subjectId = await findSubjectByCode(subj)
                await TrackSubject.create({
                    track_selection_id: newTs.id,
                    subject_id: subjectId
                })
            }

            // default_track_select.jpeg
            const newsTitle = `การคัดเลือกความเชี่ยวชาญ วิทยาลัยการคอมพิวเตอร์ หลักสูตรเทคโนโลยีสารสนเทศ ปีการศึกษา ${acadyear}`
            const desc = `เริ่มคัดเลือกตั้งแต่วันที่ ${simpleDMY(startAt)} จนถึงวันที่ ${simpleDMY(expiredAt)} ประกาศผลวันที่ ${simpleDMY(announcementDate)}`

            const subjects = await Promise.all(trackSubj.map(subj =>
                Subject.findOne({ where: { subject_code: subj } })
            ));

            const subjectList = subjects.map((subject, index) => `
                <li class="flex items-start gap-4"> 
                    <strong>${trackSubj[index]}</strong>
                    <p class="flex flex-col gap-1">
                        <span>${subject?.dataValues?.title_en || ''}</span>
                        <span>${subject?.dataValues?.title_th || ''}</span>
                    </p>
                </li>
                `).join('');

            const detail = `<p>${newsTitle} ของนักศึกษาหลักสูตรเทคโนโลยีสารสนเทศ</p>
            <p>${desc}</p>
            <p class="mt-4 mb-2">รายวิชาที่จะใช้ในการคัดเลือก</p>
            <ul class="list-disc flex flex-col gap-2">
                ${subjectList}
            </ul>`;

            await News.create({
                title: newsTitle,
                desc,
                detail,
                published: true,
                image: `${getHostname()}/images/news/default_track_select.jpeg`
            });

            return res.status(201).json({
                ok: true,
                message: `เพิ่มการคัดแทร็กปีการศึกษา ${acadyear} เรียบร้อย`
            })
        } else {
            return res.status(401).json({
                ok: false,
                message: `การคัดแทร็กปีการศึกษา ${acadyear} ถูกเพิ่มไปแล้ว`
            })
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
}

const updateTrackSelection = async (req, res) => {
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
            message: `อัพเดตข้อมูลการคัดแทร็กปีการศึกษา ${id} สำเร็จ`
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
}

const selectTrack = async (req, res) => {
    const gradeValues = {
        'A': 4.0, 'B+': 3.5, 'B': 3.0, 'C+': 2.5,
        'C': 2.0, 'D+': 1.5, 'D': 1.0, 'F': 0.0
    };

    const calGrade = (grades) => {
        const validGrades = grades.filter(grade => grade in gradeValues);
        if (validGrades.length === 0) return 0;
        const sum = validGrades.reduce((acc, grade) => acc + gradeValues[grade] * 3, 0);
        return parseFloat((sum / (validGrades.length * 3)).toFixed(6));
    };

    const sortStudentData = (a, b) =>
        b.gpa - a.gpa || new Date(a.updatedAt) - new Date(b.updatedAt);

    const getRandomTrack = (skipTrack) => {
        const tracks = ["BIT", "Network", "Web and Mobile"].filter(track => track !== skipTrack);
        return tracks[Math.floor(Math.random() * tracks.length)];
    };

    const distributeTracks = (stuData, courseType, trackCount, limit) => {
        const selectionResult = { ...stuData };
        const trackOrder = [stuData.track_order_1, stuData.track_order_2, stuData.track_order_3].filter(Boolean);

        if (trackOrder.length < 3) {
            let trackResult = selectionResult.result;
            if (trackCount[courseType][trackResult] >= limit[courseType]) {
                const usedTracks = new Set([trackResult]);
                while (usedTracks.size < 3) {
                    const randomTrack = getRandomTrack();
                    if (!usedTracks.has(randomTrack) && trackCount[courseType][randomTrack] < limit[courseType]) {
                        trackCount[courseType][randomTrack]++;
                        selectionResult.result = randomTrack;
                        return selectionResult;
                    }
                    usedTracks.add(randomTrack);
                }

                const leastFilledTrack = Object.keys(trackCount[courseType]).reduce((a, b) =>
                    trackCount[courseType][a] < trackCount[courseType][b] ? a : b
                );
                trackCount[courseType][leastFilledTrack]++;
                selectionResult.result = leastFilledTrack;
                return selectionResult;
            }
            trackCount[courseType][trackResult]++;
            return selectionResult;
        }

        for (const track of trackOrder) {
            if (trackCount[courseType][track] < limit[courseType]) {
                selectionResult.result = track;
                trackCount[courseType][track]++;
                return selectionResult;
            }
        }

        const randomTrack = getRandomTrack();
        selectionResult.result = randomTrack;
        trackCount[courseType][randomTrack]++;
        return selectionResult;
    };

    const countStudents = async (program, acadyear, coursesType) => {
        return Student.count({
            where: { program, acadyear, courses_type: coursesType },
            distinct: true,
            col: 'id',
            include: [{
                model: StudentStatus,
                where: { id: 10 }
            }]
        });
    };

    try {
        const trackSelectId = req.params.id;
        const trackSelection = await TrackSelection.findOne({
            where: { id: trackSelectId },
            include: [
                { model: Subject, attributes: subjectAttr },
                {
                    model: Selection,
                    include: [{ model: Student }, { model: SelectionDetail }]
                }
            ]
        });

        if (!trackSelection) {
            return res.status(404).json({ ok: false, message: "Track selection not found" });
        }

        const acadyear = trackSelection.acadyear;
        const subjects = trackSelection.Subjects.map(subj => subj.TrackSubject.subject_id);

        const [totalNormalCount, totalVipCount] = await Promise.all([
            countStudents("IT", acadyear, "โครงการปกติ"),
            countStudents("IT", acadyear, "โครงการพิเศษ")
        ]);

        const limit = {
            normal: Math.ceil(totalNormalCount / 3) || 1,
            vip: Math.ceil(totalVipCount / 3) || 1
        };

        const trackCount = {
            normal: { "BIT": 0, "Network": 0, "Web and Mobile": 0 },
            vip: { "BIT": 0, "Network": 0, "Web and Mobile": 0 }
        };

        const typeMapping = {
            'โครงการพิเศษ': 'vip',
            'โครงการปกติ': 'normal',
        };

        await trackSelection.update({ has_finished: !trackSelection.has_finished });

        const message = trackSelection.has_finished ? "ปิดการคัดเลือก" : "เปิดการคัดเลือก";

        if (trackSelection.has_finished) {
            const selections = trackSelection.Selections;
            if (selections.length > 0) {
                const selectDataAll = { normal: [], vip: [] };

                for (const selection of selections) {
                    const { id, stu_id, track_order_1, track_order_2, track_order_3, Student, SelectionDetails, result, updatedAt } = selection;
                    const coursesType = typeMapping[Student.courses_type];
                    const grades = SelectionDetails.map(detail => detail.grade);

                    selectDataAll[coursesType].push({
                        id, stu_id, track_order_1, track_order_2, track_order_3,
                        courses_type: coursesType, result, updatedAt,
                        gpa: calGrade(grades)
                    });
                }

                for (const courseType of Object.keys(selectDataAll)) {
                    selectDataAll[courseType].sort(sortStudentData);
                    for (const stuData of selectDataAll[courseType]) {
                        const selectionResult = distributeTracks(stuData, courseType, trackCount, limit);
                        await Selection.update({ result: selectionResult.result }, { where: { id: selectionResult.id } });
                    }
                }
            }

            // Handle students who haven't signed the form
            const unsignedStudents = await models.sequelize.query(`
                SELECT Students.stu_id, Students.courses_type
                FROM Students LEFT JOIN Selections
                ON Students.stu_id = Selections.stu_id
                WHERE Selections.stu_id IS NULL
                AND Students.acadyear = :acadyear
                AND Students.program = 'IT'
                AND Students.status_code = 10
            `, {
                replacements: { acadyear },
                type: QueryTypes.SELECT
            });

            if (unsignedStudents.length > 0) {
                const courseTypeStudents = { normal: [], vip: [] };
                unsignedStudents.forEach(student =>
                    courseTypeStudents[typeMapping[student.courses_type]].push(student.stu_id)
                );

                const createSelection = async (insertSelectionData) => {
                    const selection = await Selection.create(insertSelectionData);
                    await Promise.all(subjects.map(async (subj) => {
                        const enrollment = await Enrollment.findOne({
                            where: { stu_id: insertSelectionData.stu_id, subject_id: subj },
                            attributes: ["grade"],
                        });
                        await SelectionDetail.create({
                            selection_id: selection.id,
                            subject_id: subj,
                            grade: enrollment?.grade || null
                        });
                    }));
                };

                for (const courseType of Object.keys(courseTypeStudents)) {
                    const tracks = ["BIT", "Network", "Web and Mobile"];
                    const studentIDArray = courseTypeStudents[courseType];

                    while (studentIDArray.length > 0) {
                        for (const track of [...tracks]) {
                            if (studentIDArray.length === 0) break;
                            if (trackCount[courseType][track] === limit[courseType]) {
                                tracks.splice(tracks.indexOf(track), 1);
                                continue;
                            }
                            const studentId = studentIDArray.pop();
                            await createSelection({
                                track_selection_id: trackSelectId,
                                stu_id: studentId,
                                result: track
                            });
                            trackCount[courseType][track]++;
                        }

                        if (studentIDArray.length === 0) break;
                        if (tracks.length === 0) {
                            const studentId = studentIDArray.pop();
                            const minTrackCount = Math.min(...Object.values(trackCount[courseType]));
                            const availableTracks = Object.keys(trackCount[courseType]).filter(
                                track => trackCount[courseType][track] === minTrackCount
                            );
                            const randomTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)];
                            await createSelection({
                                track_selection_id: trackSelectId,
                                stu_id: studentId,
                                result: randomTrack
                            });
                            trackCount[courseType][randomTrack]++;
                        }
                    }
                }
            }
        }

        return res.status(200).json({ ok: true, message });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ ok: false, message: "Server error." });
    }
};

const deleteTraclSelect = async (req, res) => {
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
            message: `ลบการคัดแทร็กปีการศึกษา ${id} เรียบร้อย`
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
}

const multipleDelete = async (req, res) => {
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
                message: "ไม่มีการคัดแทร็กที่ถูกลบ"
            })
        } else {
            return res.status(200).json({
                ok: true,
                message: `ลบการคัดแทร็กปีการศึกษา ${delAcad.join(", ")} เรียบร้อย`
            })
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
}
const getStudentNonSelect = async (req, res) => {
    const acadyear = req.params.acadyear
    try {
        const students = await models.sequelize.query(`
        SELECT Students.stu_id , CONCAT(Students.first_name, ' ', Students.last_name) AS fullname, Students.courses_type
        FROM Students
        LEFT JOIN Selections ON Students.stu_id = Selections.stu_id
        WHERE Selections.id IS NULL
        AND Students.acadyear = ${acadyear}
        AND Students.program LIKE 'IT'
        AND Students.status_code = 10
        ORDER BY Students.courses_type;
        `, {
            type: QueryTypes.SELECT
        });
        return res.status(200).json({
            ok: true,
            data: students
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error.",
            error
        })
    }
}
module.exports = {
    testSelection,
    getAllTrackSelections,
    getTrackSelections,
    getStudentInTrackSelection,
    getDashboardData,
    getMostPopularTrack,
    getSubjectInTrackSelection,
    getLastest,
    getStudentAndSubject,
    createTrackSelection,
    updateTrackSelection,
    selectTrack,
    deleteTraclSelect,
    multipleDelete,
    getStudentNonSelect,
    sendEmailToStudent
}