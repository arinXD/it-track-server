const { Op } = require('sequelize');
const models = require('../models');
const Teacher = models.Teacher;
const Student = models.Student;

const getAllTeachers = async (req, res) => {
     try {
          const data = await Teacher.findAll();
          return res.status(200).json({
               ok: true,
               data
          });
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: "Server error."
          });
     }
};
const getTeacherByEmail = async (req, res) => {
     const { email } = req.params
     try {
          const data = await Teacher.findOne({
               where: { email }
          });
          return res.status(200).json({
               ok: true,
               data
          });
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: "Server error."
          });
     }
};

const hasAdvisor = async (req, res) => {
     const { id } = req.params
     try {
          const data = await Student.findOne({
               where: {
                    stu_id: id,
                    advisor: {
                         [Op.ne]: null
                    }
               }
          });
          return res.status(200).json({
               ok: true,
               data
          });
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: "Server error."
          });
     }
};

const createStudentAdvisor = async (req, res) => {
     const { aid: advisor, sid: stu_id } = req.params
     try {
          await Student.update({ advisor }, {
               where: { stu_id, }
          });
          return res.status(200).json({
               ok: true,
               message: "บันทึกข้อมูลสำเร็จ"
          });
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: "ไม่สามารถบันทึกข้อมูลได้ (Internal server error)"
          });
     }
}

const createStudentAdvisorSpreadSheet = async (req, res) => {
     async function bulkUpsertStudentAdvisor(arr) {
          for (let index = 0; index < arr.length; index++) {
               const row = arr[index];
               // studentname
               // studentsurname
               // officername
               // officersurname

               const student = await Student.findOne({
                    where: {
                         first_name: row.studentname,
                         last_name: row.studentsurname
                    }
               });

               const teacher = await Teacher.findOne({
                    where: {
                         name: row.officername,
                         surname: row.officersurname
                    }
               });

               if (student && teacher) {
                    student.advisor = teacher?.dataValues?.id
                    await student.save()
               }
          }
     }

     const rawData = req.body
     const data = rawData.filter(row => {
          if (
               row["studentname"] != null &&
               row["studentsurname"] != null &&
               row["officername"] != null &&
               row["officersurname"] != null
          ) {
               return row
          }
     })
     try {
          bulkUpsertStudentAdvisor(data)
          return res.status(200).json({
               ok: true,
               message: "เพิ่มข้อมูลสำเร็จ"
          })
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const deleteFromAdvisor = async (req, res) => {
     const ids = req.body
     try {
          await Student.update({ advisor: null }, {
               where: {
                    id: {
                         [Op.in]: ids
                    }
               }
          });
          return res.status(200).json({
               ok: true,
               message: "ลบนักศึกษาออกจากที่ปรึกษาสำเร็จ"
          });
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: "ไม่สามารถบันทึกข้อมูลได้ (Internal server error)"
          });
     }
}


module.exports = {
     getAllTeachers,
     getTeacherByEmail,
     hasAdvisor,
     createStudentAdvisor,
     createStudentAdvisorSpreadSheet,
     deleteFromAdvisor
}