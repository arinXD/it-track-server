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

module.exports = {
    convertGrade
}