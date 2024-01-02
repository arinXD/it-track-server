const { insertToDB } = require("./queryFunction")
const enrollments = "./csv/student_course.csv";

class Enrollment {
    //  W ถอน
    //  S ผ่าน
    //  U ไม่ผ่าน
    //  S AU ไม่รู้
    //  I ไม่สามารถเข้ารับการวัดผล
    constructor(source) {
        this.studentCode = source["STUDENTCODE"];
        this.courseCode = source["COURSECODE"];
        this.gradeEntry = source["GRADEENTRY2"];
    }
    getData() {
        const studentCourse = {
            studentCode: this.studentCode,
            courseCode: this.courseCode,
            gradeEntry: this.gradeEntry,
        }
        return Object.values(studentCourse)
    }
    getInsertStatement() {
        const data = this.getData()
        const insertStatement = `INSERT INTO Enrollments (stu_id, subject_code, grade, createdAt, updatedAt) values(?, ?, ?, ?, ?)`;
        const items = [...data, new Date(), new Date()]
        return { insertStatement, items }
    }
}

try {
    insertToDB(enrollments, Enrollment)
} catch (err) {
    console.error(err);
}

