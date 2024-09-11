const { Teacher, TeacherTrack } = require('../models');

const getAllTeachers = async (req, res) => {
     try {
          const teachers = await Teacher.findAll({
               order: [['updatedAt', 'DESC'],],
               include: [
                    { model: TeacherTrack }
               ]
          });
          return res.status(200).json({
               ok: true,
               data: teachers
          })
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: 'Error fetching teachers',
               error: error.message
          });
     }
}
const getAllTeacherByID = async (req, res) => {
     const { id } = req.params
     try {
          const teacher = await Teacher.findOne({
               where: { id },
               include: [
                    { model: TeacherTrack }
               ]
          });
          return res.status(200).json({
               ok: true,
               data: teacher
          })
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: 'Error fetching teachers',
               error: error.message
          });
     }
}

const createTeacher = async (req, res) => {
     try {
          const { email, prefix, name, surname } = req.body;
          const newTeacher = await Teacher.create({
               email,
               prefix,
               name,
               surname
          });
          return res.status(201).json({
               ok: true,
               message: 'เพิ่มข้อมูลสำเร็จ',
               data: newTeacher
          });
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: 'Error creating teachers',
               error: error.message
          });
     }
}

const updateTeacher = async (req, res) => {
     try {
          const { id } = req.params;
          const { email, prefix, name, surname } = req.body;
          const [updated] = await Teacher.update(
               { email, prefix, name, surname },
               { where: { id } }
          );
          if (updated) {
               const updatedTeacher = await Teacher.findByPk(id);
               return res.status(200).json({
                    ok: true,
                    data: updatedTeacher,
                    message: 'Teacher not found'
               });
          } else {
               return res.status(404).json({
                    ok: false,
                    message: 'Teacher not found'
               });
          }
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: 'Error updating teacher',
               error: error.message
          });
     }
}

const updateTeacherTrack = async (req, res) => {
     try {
          const { teacher_id } = req.params;
          const trackData = req.body;
          const [updated] = await TeacherTrack.update(trackData, {
               where: { teacher_id }
          });
          if (updated) {
               const updatedTrack = await TeacherTrack.findOne({ where: { teacher_id } });
               return res.status(200).json({
                    ok: true,
                    data: updatedTrack
               });
          } else {
               return res.status(404).json({
                    ok: false,
                    message: 'Teacher track not found'
               });
          }
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: 'Error updating teacher track',
               error: error.message
          });
     }
}

const deleteTeacher = async (req, res) => {
     try {
          const { id } = req.params;
          const deleted = await Teacher.destroy({
               where: { id },
               force: true
          });
          if (deleted) {
               return res.status(204).json({
                    ok: true,
                    data: deleted,
                    message: "Teacher deleted"
               });
          } else {
               return res.status(404).json({
                    ok: false,
                    message: 'Teacher not found'
               });
          }
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: 'Error deleting teacher',
               error: error.message
          });
     }
}

module.exports = {
     getAllTeachers,
     getAllTeacherByID,
     createTeacher,
     updateTeacher,
     updateTeacherTrack,
     deleteTeacher,
}