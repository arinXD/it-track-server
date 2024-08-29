const Joi = require('joi');
const models = require('../models');
const { QueryTypes } = require('sequelize');
const User = models.User
const Student = models.Student
const Program = models.Program
const Enrollment = models.Enrollment
const Subject = models.Subject
const Selection = models.Selection

const userAttr = ["email", "role", "sign_in_type", "createdAt"]
const studentAttr = ["stu_id", "first_name", "last_name", "courses_type"]

const emailSchema = Joi.string().email().required()
const gradeOrder = {
     'A': 1, 'B+': 2, 'B': 3, 'C+': 4, 'C': 5, 'D+': 6, 'D': 7, 'F': 8
};

const getAllUsers = async (req, res) => {
     try {
          const users = await User.findAll({
               order: [['createdAt', 'DESC'],]
          })
          return res.status(200).json({
               ok: true,
               data: users
          })
     } catch (error) {
          console.error(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

async function getStudentGPA(stuid) {
     const gpa = await models.sequelize.query(`
          SELECT Students.stu_id AS stuid,
          SUM((CASE 
                    WHEN Enrollments.grade IN ('A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F') THEN 
                         CASE Enrollments.grade
                              WHEN 'A' THEN 4
                              WHEN 'B+' THEN 3.5
                              WHEN 'B' THEN 3
                              WHEN 'C+' THEN 2.5
                              WHEN 'C' THEN 2
                              WHEN 'D+' THEN 1.5
                              WHEN 'D' THEN 1
                              WHEN 'F' THEN 0
                         END
                    ELSE 0
               END) * Subjects.credit) / 
               (SELECT SUM(Subjects.credit)
                    FROM Subjects, Enrollments
                    WHERE Subjects.subject_id = Enrollments.subject_id
                    AND Students.stu_id = Enrollments.stu_id
                    AND Enrollments.grade IN ('A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F')
                    GROUP BY Enrollments.stu_id) as gpa
          FROM Enrollments
          JOIN Students ON Enrollments.stu_id = Students.stu_id
          JOIN Subjects ON Enrollments.subject_id = Subjects.subject_id
          WHERE Students.stu_id = ${stuid}
          GROUP BY stuid
          ORDER BY stuid ASC`, {
          type: QueryTypes.SELECT
     });

     if (gpa.length && gpa[0].gpa !== null) {
          return parseFloat(gpa[0].gpa);
     }

     return gpa[0]?.gpa
}

const getUserData = async (req, res) => {
     const email = req.params.email
     const { error } = emailSchema.validate(email);

     if (error) {
          return res.status(400).json({
               ok: false,
               message: `Validation error: ${error.details[0].message}`
          });
     }

     try {
          const data = await User.findOne({
               attributes: userAttr,
               where: {
                    email
               },
               include: [
                    {
                         model: Student,
                         attributes: studentAttr,
                         include: [
                              {
                                   model: Selection,
                                   attributes: ["result"],
                              },
                              {
                                   model: Program,
                                   attributes: ["program", "title_th", "title_en"],
                              },
                              {
                                   model: Enrollment,
                                   attributes: ["grade", "enroll_year"],
                                   order: [
                                        ['enroll_year', 'DESC']
                                   ],
                                   include: [
                                        {
                                             model: Subject,
                                             attributes: ["subject_code", "title_th", "title_en"],
                                             required: true
                                        }
                                   ]
                              },
                         ],
                    },
               ],
          })

          if (data && data?.dataValues?.Student) {
               const groupedEnrollments = {}
               const enrollments = data?.dataValues?.Student?.dataValues?.Enrollments.sort((a, b) => (b?.dataValues?.enroll_year - a?.dataValues?.enroll_year))
               for (let index = 0; index < enrollments.length; index++) {
                    const enroll = enrollments[index];
                    if (!groupedEnrollments[enroll?.dataValues?.enroll_year]) {
                         groupedEnrollments[enroll?.dataValues?.enroll_year] = []
                    }
                    groupedEnrollments[enroll?.dataValues?.enroll_year].push(enroll?.dataValues)

               }
               for (const year in groupedEnrollments) {
                    groupedEnrollments[year].sort((a, b) => {
                         return (gradeOrder[a.grade] || 9) - (gradeOrder[b.grade] || 9);
                    });
               }

               data.Student.dataValues.Enrollments = groupedEnrollments;
               data.Student.dataValues.track = data.Student?.dataValues?.Selection?.result
               data.Student.dataValues.gpa = await getStudentGPA(data.Student?.dataValues?.stu_id)

               delete data.Student.dataValues.Selection
          }

          return res.status(200).json({
               ok: true,
               data
          })
     } catch (error) {
          console.error(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const updateUserRole = async (req, res) => {
     const id = req.params.id
     const role = req.params.role
     try {
          const users = await User.update({
               role,
          }, { where: { id } })
          return res.status(200).json({
               ok: true,
               data: users
          })
     } catch (error) {
          console.error(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

module.exports = {
     getUserData,
     getAllUsers,
     updateUserRole
}