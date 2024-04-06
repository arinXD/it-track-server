const models = require('../models');
const Subject = models.Subject
 
async function findSubjectByCode(subject_code) {
    const subject = await Subject.findOne({
        where: {
            subject_code: subject_code
        }
    })
    const subjectId = subject?.dataValues?.subject_id
    return subjectId
}

module.exports = {
    findSubjectByCode
}