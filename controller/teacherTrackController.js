const models = require('../models');
const Teacher = models.Teacher;
const TeacherTrack = models.TeacherTrack;
const { getHostname } = require('../api/hostname');
const fs = require('fs');
const path = require('path');

const getAllTeacherTracks = async (req, res) => {
     try {
          const data = await TeacherTrack.findAll();
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

const getTeachersByTrack = async (req, res) => {
     const track = req.params.track;
     try {
          const data = await Teacher.findAll({
               attributes: ["id", "user_id", "email", "prefix", "name", "surname"],
               include: [
                    {
                         model: TeacherTrack,
                         attributes: ["id", "image"],
                         where: {
                              track
                         }
                    }
               ]
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

const getTeachersNotInTrack = async (req, res) => {
     console.log("dawd");
     try {
          const data = await Teacher.findAll({
               attributes: ["id", "user_id", "email", "prefix", "name", "surname"],
               include: [
                    {
                         model: TeacherTrack,
                         attributes: ["id", "image", "track"],
                         required: false,
                    }
               ],
               where: {
                    '$TeacherTrack.id$': null
               }
          });

          return res.status(200).json({
               ok: true,
               data
          });
     } catch (error) {
          console.error('Error in getTeachersNotInTrack:', error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          });
     }
};

const createOrUpdateTeacher = async (req, res) => {
     const image = `${getHostname()}/images/teachers/${req.fileName}`;
     const insertData = req.body;
     const existProfessor = await TeacherTrack.findOne({
          where: {
               teacherName: insertData.teacherName
          }
     });
     let upsertData = existProfessor && Object.keys(existProfessor).length > 0
          ? { ...insertData, id: existProfessor.dataValues.id }
          : insertData;
     upsertData.image = image;
     try {
          await TeacherTrack.upsert(upsertData);
          if (existProfessor && Object.keys(existProfessor).length > 0 && existProfessor.dataValues.image) {
               const oldFileName = existProfessor.dataValues.image.split("/").pop();
               const oldFilePath = path.join(__dirname, `../public/images/teachers/${oldFileName}`);
               if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
               }
          }
          return res.status(200).json({
               ok: true,
               message: "เพิ่มข้อมูลสำเร็จ"
          });
     } catch (error) {
          console.log(req.fileName);
          const filePath = path.join(__dirname, `../public/images/teachers/${req.fileName}`);
          if (fs.existsSync(filePath)) {
               fs.unlinkSync(filePath);
          }
          return res.status(401).json({
               ok: false,
               message: "เพิ่มข้อมูลไม่สำเร็จ"
          });
     }
};

const updateTeacherForm = async (req, res) => {
     const tid = req.params.tid;
     const image = `${getHostname()}/images/teachers/${req.fileName}`;
     const { teacherName } = req.body;
     try {
          const teacherData = await TeacherTrack.findOne({
               where: {
                    id: tid
               }
          });
          let oldFilePath;
          if (teacherData && Object.keys(teacherData).length > 0 && teacherData.dataValues.image) {
               const oldFileName = teacherData.dataValues.image.split("/").pop();
               oldFilePath = path.join(__dirname, `../public/images/teachers/${oldFileName}`);
          }
          teacherData.image = image;
          teacherData.teacherName = teacherName;
          await teacherData.save();
          if (oldFilePath && fs.existsSync(oldFilePath)) {
               fs.unlinkSync(oldFilePath);
          }
          return res.status(200).json({
               ok: true,
               message: "เพิ่มข้อมูลสำเร็จ"
          });
     } catch (error) {
          console.log(req.fileName);
          console.log(error);
          const filePath = path.join(__dirname, `../public/images/teachers/${req.fileName}`);
          if (fs.existsSync(filePath)) {
               fs.unlinkSync(filePath);
          }
          return res.status(401).json({
               ok: false,
               message: "เพิ่มข้อมูลไม่สำเร็จ"
          });
     }
};

const updateTeacherJson = async (req, res) => {
     const tid = req.params.tid;
     const updateData = req.body;
     try {
          await TeacherTrack.update(updateData, {
               where: {
                    id: tid
               }
          });
          return res.status(200).json({
               ok: true,
               message: "เพิ่มข้อมูลสำเร็จ"
          });
     } catch (error) {
          return res.status(401).json({
               ok: false,
               message: "เพิ่มข้อมูลไม่สำเร็จ"
          });
     }
};

const deleteTeachers = async (req, res) => {
     const teacherId = req.body;
     try {
          for (const tid of teacherId) {
               await TeacherTrack.destroy({
                    where: {
                         id: tid
                    },
                    force: true
               });
          }
          return res.status(200).json({
               ok: true,
               message: "ลบข้อมูลสำเร็จ"
          });
     } catch (error) {
          return res.status(401).json({
               ok: false,
               message: "ลบข้อมูลไม่สำเร็จ"
          });
     }
};

module.exports = {
     getAllTeacherTracks,
     getTeachersByTrack,
     createOrUpdateTeacher,
     updateTeacherForm,
     updateTeacherJson,
     deleteTeachers,
     getTeachersNotInTrack
};