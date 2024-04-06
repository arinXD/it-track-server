const { findSubjectByCode } = require("../utils/subject")
class Enrollment {
    //  W ถอน
    //  S ผ่าน
    //  U ไม่ผ่าน
    //  S AU ไม่รู้
    //  I ไม่สามารถเข้ารับการวัดผล
    constructor(source) {
        this.studentCode = source["STUDENTCODE"];
        this.courseId = source["COURSECODE"];
        this.gradeEntry = source["GRADEENTRY2"] || null;
        this.acadyear = source["ACADYEAR"];
    }
    async getCourseId(subject_code){
        return await findSubjectByCode(subject_code)
    }
    async getData() {
        return [
            this.studentCode, 
            await this.getCourseId(this.courseId),
            this.gradeEntry, 
            this.acadyear];
    }
    async getInsertStatement() {
        const data = await this.getData()
        const insertStatement = `INSERT INTO Enrollments (stu_id, subject_id, grade, enroll_year, createdAt, updatedAt) values(?, ?, ?, ?, ?, ?)`;
        const items = [...data, new Date(), new Date()]
        return { insertStatement, items }
    }
}

module.exports = { Enrollment }