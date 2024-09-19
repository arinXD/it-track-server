const Joi = require('joi');
const bcrypt = require("bcryptjs");
const models = require('../models');
const { QueryTypes, Op } = require('sequelize');
const User = models.User
const Student = models.Student
const Teacher = models.Teacher
const Admin = models.Admin
const Program = models.Program
const Enrollment = models.Enrollment
const Subject = models.Subject
const Selection = models.Selection
const TeacherTrack = models.TeacherTrack

const userAttr = ["email", "role", "sign_in_type", "createdAt"]
const studentAttr = ["stu_id", "first_name", "last_name", "courses_type"]

const emailSchema = Joi.string().email().required()
const gradeOrder = {
     'A': 1, 'B+': 2, 'B': 3, 'C+': 4, 'C': 5, 'D+': 6, 'D': 7, 'F': 8
};

function getAcadYear(studentCode) {
     const currentYear = ((new Date().getFullYear()) + 543).toString();
     const firstTwoDigits = currentYear.slice(0, 2);
     const acadyear = `${firstTwoDigits}${studentCode.slice(0, 2)}`
     return parseInt(acadyear)
}

const createUser = async (req, res) => {
     const { role, email, password, ...otherData } = req.body;
     const { id, prefix, name, surname } = otherData;
     const t = await User.sequelize.transaction();

     try {
          switch (role) {
               case 'admin':
                    // แทรกไอดีมาแก้ไขข้อมูล
                    if (id) {
                         await Admin.update({
                              email,
                              prefix,
                              name,
                              surname,
                         }, { where: { id } }, { transaction: t });
                    }
                    // สร้างใหม่
                    else {
                         const createAdminData = {
                              email,
                              role,
                              verification: true,
                              sign_in_type: 'credentials',
                         }
                         const hashedPassword = await bcrypt.hash(password, 10)
                         createAdminData.password = hashedPassword
                         const createdUser = await User.create(createAdminData, { transaction: t });
                         const user_id = createdUser.dataValues.id

                         await Admin.create({
                              user_id,
                              email,
                              prefix,
                              name,
                              surname,
                         }, { transaction: t })
                    }
                    break;

               case 'teacher':
                    const { track } = otherData;

                    // แทรกไอดีมาแก้ไขข้อมูล
                    if (id) {
                         await Teacher.update({
                              email,
                              prefix,
                              name,
                              surname,
                         }, { where: { id } }, { transaction: t });

                         const ttrack = await TeacherTrack.findOne({ where: { teacher_id: id } })

                         if (track) {
                              if (ttrack) {
                                   await TeacherTrack.update({ track },
                                        { where: { teacher_id: id } },
                                        { transaction: t });
                              } else {
                                   await TeacherTrack.create({
                                        teacher_id: id,
                                        track,
                                   }, { transaction: t });
                              }
                         } else {
                              await TeacherTrack.update({ track: null },
                                   { where: { teacher_id: id } },
                                   { transaction: t });

                         }
                    }
                    // สร้างใหม่
                    else {
                         const teacher = await Teacher.create({
                              email,
                              prefix,
                              name,
                              surname,
                         }, { transaction: t });

                         if (track) {
                              await TeacherTrack.create({
                                   teacher_id: teacher.id,
                                   track,
                              }, { transaction: t });
                         }
                    }
                    break;
               case 'student':
                    const { stu_id, first_name, last_name, courses_type, program } = otherData;
                    await Student.create({
                         stu_id,
                         email,
                         first_name,
                         last_name,
                         courses_type,
                         program,
                         acadyear: getAcadYear(stu_id),
                         status_code: 10
                    }, { transaction: t });
                    break;
               default:
                    throw new Error('Invalid role');
          }

          await t.commit();

          return res.status(201).json({
               message: 'User created successfully',
          });
     } catch (error) {
          await t.rollback();

          console.error('Error creating user:', error);

          if (error.name === 'SequelizeUniqueConstraintError') {
               if (error.errors && error.errors.length > 0) {
                    const constraintError = error.errors[0];
                    if (constraintError.path === 'email') {
                         return res.status(400).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' });
                    } else if (constraintError.path === 'stu_id') {
                         return res.status(400).json({ message: 'รหัสนักศึกษานี้ถูกใช้งานแล้ว' });
                    }
               }
               return res.status(400).json({ message: 'ข้อมูลนี้ถูกใช้งานแล้ว' });
          }

          return res.status(500).json({
               message: 'Error creating user',
               error: error.message
          });
     }
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
                         model: Admin,
                         attributes: ["id", "prefix", "name", "surname"],
                    },
                    {
                         model: Teacher,
                         attributes: ["id", "prefix", "name", "surname"],
                         include: [
                              {
                                   model: TeacherTrack,
                                   attributes: ["track"],
                              },
                         ]
                    },
                    {
                         model: Student,
                         attributes: studentAttr,
                         include: [
                              {
                                   model: Teacher,
                                   as: "Advisor",
                                   attributes: ["id", "prefix", "name", "surname"],
                              },
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
     const { role, email } = req.body
     try {
          if (role === "teacher") {
               const findData = await Teacher.findOne({ where: { email } })
               if (findData) {
                    await Teacher.update({
                         user_id: id
                    }, { where: { email: email } })
               } else {
                    await Teacher.create({
                         user_id: id,
                         email: email,
                         name: String(email).split("@")[0]
                    })
               }
               await Admin.update({ user_id: null }, { where: { email } })
          } else if (role === "admin") {
               const findData = await Admin.findOne({ where: { email } })
               if (findData) {
                    await Admin.update({
                         user_id: id
                    }, { where: { email: email } })
               } else {
                    await Admin.create({
                         user_id: id,
                         email: email,
                         name: String(email).split("@")[0]
                    })
               }
               await Teacher.update({ user_id: null }, { where: { email } })
          } else {
               await Teacher.update({ user_id: null }, { where: { email } })
               await Admin.update({ user_id: null }, { where: { email } })
          }

          await User.update({
               role,
          }, { where: { id } })
          return res.status(200).json({
               ok: true,
          })
     } catch (error) {
          console.error(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const deleteUser = async (req, res) => {
     const id = req.params.id
     try {
          await User.destroy({
               where: { id },
               force: true
          })
          return res.status(200).json({
               ok: true,
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
     updateUserRole,
     deleteUser,
     createUser
}