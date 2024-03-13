class Enrollment {
    //  W ถอน
    //  S ผ่าน
    //  U ไม่ผ่าน
    //  S AU ไม่รู้
    //  I ไม่สามารถเข้ารับการวัดผล
    constructor(source) {
        this.studentCode = source["STUDENTCODE"];
        this.courseCode = source["COURSECODE"];
        this.gradeEntry = source["GRADEENTRY2"] || null;
        this.acadyear = source["ACADYEAR"];
    }
    getData() {
        return [this.studentCode, this.courseCode, this.gradeEntry, this.acadyear];
    }
    getInsertStatement() {
        const data = this.getData()
        const insertStatement = `INSERT INTO Enrollments (stu_id, subject_code, grade, enroll_year, createdAt, updatedAt) values(?, ?, ?, ?, ?, ?)`;
        const items = [...data, new Date(), new Date()]
        return { insertStatement, items }
    }
}

module.exports = { Enrollment }