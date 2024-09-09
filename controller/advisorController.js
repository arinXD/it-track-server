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
};


module.exports = {
     getAllTeachers,
     hasAdvisor,
     createStudentAdvisor,
}