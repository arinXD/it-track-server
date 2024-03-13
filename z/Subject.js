class Subject {
    constructor(source) {
        this.courseCode = source["COURSECODE"];
        this.courseName = source["COURSENAME"];
        this.courseNameEng = source["COURSENAMEENG"];
        this.creditTotal = source["CREDITTOTAL"];
    }
    getData() {
        return [this.courseCode, this.courseName, this.courseNameEng, this.creditTotal];
    }
    getInsertStatement() {
        const data = this.getData()
        const insertStatement = `INSERT INTO Subjects (subject_code, title_th, title_en, credit, createdAt, updatedAt) values(?, ?, ?, ?, ?, ?)`;
        const items = [...data, new Date(), new Date()]
        return {
            insertStatement,
            items
        }
    }
}

module.exports = {
    Subject
}