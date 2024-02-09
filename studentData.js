const {
    insertToDB
} = require("./queryFunction")
const students = "./csv/studentdata.csv";

class Student {
    constructor(source) {
        this.studentCode = source["STUDENTCODE"];
        this.email = source["KKUMAIL"]
        this.firstName = source["STUDENTNAME"]
        this.lastName = source["STUDENTSURNAME"]
        this.stuStatus = source["STUDENTSTATUS"]
        const programString = source["PROGRAMNAME"];
        this.program = this.getProgram(programString)
        this.coursesType = this.getCoursesType(programString)
        this.acadyear = this.getAcadYear()
    }
    getAcadYear() {
        const acadyear = `25${this.studentCode.slice(0, 2)}`
        return parseInt(acadyear)
    }
    getCoursesType(program) {
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
    getProgram(program) {
        const programs = {
            "วิทยาการคอมพิวเตอร์": "CS",
            "เทคโนโลยีสารสนเทศ": "IT",
            "ภูมิสารสนเทศศาสตร์": "GIS",
            "ปัญญาประดิษฐ์": "AI",
            "ความมั่นคงปลอดภัยไซเบอร์": "Cyber",
            default: "Invalid program"
        }
        const programResult = program.split(" ")[0]
        return programs[programResult] ?? programs.default;
    }
    getStatus(statusCode) {
        return statusCode
    }
    getData() {
        const studentData = {
            studentCode: this.studentCode,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            stuStatus: this.stuStatus,
            program: this.program,
            coursesType: this.coursesType,
            acadyear: this.acadyear,
        }
        return Object.values(studentData)
    }
    getInsertStatement() {
        const data = this.getData()
        const insertStatement = `INSERT INTO Students (stu_id, email, first_name, last_name, stu_status, program, courses_type, acadyear, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const items = [...data, new Date(), new Date()]
        return {
            insertStatement,
            items
        }
    }
}

try {
    insertToDB(students, Student)
} catch (err) {
    console.error(err);
}