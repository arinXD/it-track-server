const { insertToDB } = require("./queryFunction")
const subject = "./csv/subjects.csv";

class Subject {
    constructor(source) {
        this.courseCode = source["COURSECODE"];
        this.courseName = source["COURSENAME"];
        this.courseNameEng = source["COURSENAMEENG"];
        this.creditTotal = source["CREDITTOTAL"];
    }
    getData() {
        const course = {
            courseCode: this.courseCode,
            courseName: this.courseName,
            courseNameEng: this.courseNameEng,
            creditTotal: this.creditTotal,
        }
        return Object.values(course)
    }
    getInsertStatement() {
        const data = this.getData()
        const insertStatement = `INSERT INTO Subjects (subject_code, title_th, title_en, credit, createdAt, updatedAt) values(?, ?, ?, ?, ?, ?)`;
        const items = [...data, new Date(), new Date()]
        return { insertStatement, items }
    }
}

try {
    insertToDB(subject, Subject)
} catch (err) {
    console.error(err);
}
