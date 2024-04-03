function getProgram(program) {
    program = program.split(" ")[0]
    const programs = {
        "วิทยาการคอมพิวเตอร์": "CS",
        "เทคโนโลยีสารสนเทศ": "IT",
        "ภูมิสารสนเทศศาสตร์": "GIS",
        "ปัญญาประดิษฐ์": "AI",
        "ความมั่นคงปลอดภัยไซเบอร์": "Cyber",
        "CS": "CS",
        "IT": "IT",
        "GIS": "GIS",
        "AI": "AI",
        "Cyber": "Cyber",
        default: "IT"
    }
    return programs[program] || programs.default
}

function getCourse(program) {
    let course = program.split(" ")[1]
    if (course) course = course.replace(/[()]/g, '');
    const courses = {
        "โครงการพิเศษ": "โครงการพิเศษ",
        default: "โครงการปกติ"
    }
    return courses[course] || courses.default
}

function getAcadYear(stu_id) {
    const acadyear = `25${stu_id.slice(0, 2)}`
    return parseInt(acadyear)
}

module.exports = {
    getProgram,
    getCourse,
    getAcadYear,
}