const { insertToDB } = require("./queryFunction")
const students = "./csv/studentdata.csv";

class Student {
    constructor(source) {
        this.studentCode = source["STUDENTCODE"];
        this.email = source["KKUMAIL"]
        const string = source["PROGRAMNAME"];
        this.program = this.getProgram(string)
        this.coursesType = this.getCoursesType(string)
        this.acadyear = this.getAcadYear();
    }
    getAcadYear() {
        const acadyear = `25${this.studentCode.slice(0, 2)}`
        return parseInt(acadyear)
    }
    getCoursesType(string) {
        const regex = /[()]/g;
        let type = string.split(" ")[1];
        if (type) {
            type = type.replace(regex, "");
        } else {
            type = "โครงการปกติ"
        }
        return type;
    }
    getProgram(string) {
        const programs = {
            "วิทยาการคอมพิวเตอร์": "CS",
            "เทคโนโลยีสารสนเทศ": "IT",
            "ภูมิสารสนเทศศาสตร์": "GIS",
            "ปัญญาประดิษฐ์": "AI",
            "ความมั่นคงปลอดภัยไซเบอร์": "Cyber",
        }
        const program = string.split(" ")[0]
        if (programs.hasOwnProperty(program)) {
            return programs[program];
        } else {
            return 'Invalid program';
        }
    }
    getData() {
        const studentData = {
            studentCode: this.studentCode,
            email: this.email,
            program: this.program,
            coursesType: this.coursesType,
            acadyear: this.acadyear,
        }
        return Object.values(studentData)
    }
    getInsertStatement() {
        const data = this.getData()
        const insertStatement = `INSERT INTO Students (stu_id, email, program, courses_type, acadyear, createdAt, updatedAt) values(?, ?, ?, ?, ?, ?, ?)`;
        const items = [...data, new Date(), new Date()]
        return { insertStatement, items }
    }
}

try {
    insertToDB(students, Student)
} catch (err) {
    console.error(err);
}
