const models = require('../models');
const Selection = models.Selection
const SelectionDetail = models.SelectionDetail
const Enrollment = models.Enrollment
const TrackSelection = models.TrackSelection
const Subject = models.Subject

const getResultInSelectionByStuId = async (req, res) => {
     const stuid = req.params.stuid
     try {
          const track = await Selection.findOne({
               where: {
                    stu_id: stuid
               },
               attributes: ["result"]
          })
          return res.status(200).json({
               ok: true,
               data: track
          })
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const getResultInSelectionById = async (req, res) => {
     const id = req.params.id
     try {
          const track = await Selection.findOne({
               where: {
                    id
               },
          })
          return res.status(200).json({
               ok: true,
               data: track
          })
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const updateSelection = async (req, res) => {
     const id = req.params.id
     const data = req.body
     try {
          await Selection.update(data, {
               where: {
                    id
               },
          })
          return res.status(200).json({
               ok: true,
               message: "บันทึกข้อมูลการคัดเลือก"
          })
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

async function getGradeInEnrollment(stu_id, subject_id) {
     const enrollment = await Enrollment.findOne({
          where: {
               stu_id,
               subject_id,
          },
          attributes: ["grade"]
     })
     return enrollment?.dataValues?.grade || null
}

const createSelection = async (req, res) => {
     const data = req.body;
     const { stu_id, acadyear } = data;

     try {
          const existingSelection = await Selection.findOne({ where: { stu_id } });

          if (existingSelection) {
               return res.status(400).json({
                    ok: false,
                    message: "ข้อมูลการคัดเลือกสำหรับรหัสนักศึกษานี้มีอยู่แล้ว"
               });
          }
          const ts = await TrackSelection.findOne({
               where: { acadyear },
               include: [{ model: Subject, },],
          })
          data.track_selection_id = ts?.dataValues?.id
          const sl = await Selection.create(data);
          const allSubjects = ts?.dataValues?.Subjects
          for (let index = 0; index < allSubjects.length; index++) {
               const subject_id = allSubjects[index]?.dataValues?.subject_id;
               const grade = await getGradeInEnrollment(stu_id, subject_id)
               const sld = await SelectionDetail.findOne({
                    where: {
                         selection_id: sl?.dataValues?.id,
                         subject_id,
                    }
               })
               if (sld) {
                    continue
               } else {
                    await SelectionDetail.create({
                         selection_id: sl?.dataValues?.id,
                         subject_id,
                         grade,
                    })
               }
          }

          return res.status(200).json({
               ok: true,
               message: "เพิ่มข้อมูลการคัดเลือกสำเร็จ"
          });
     } catch (error) {
          console.error(error);
          return res.status(500).json({
               ok: false,
               message: "ไม่มีข้อมูลนักศึกษา"
          });
     }
};

const deleteSelection = async (req, res) => {
     const ids = req.body
     try {
          const deleted = await Selection.destroy({
               where: { id: ids },
               force: true
          });
          return res.status(200).json({
               ok: true,
               message: `ลบข้อมูลการคัดเลือก ${deleted} records`
          })
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}


module.exports = {
     getResultInSelectionByStuId,
     getResultInSelectionById,
     updateSelection,
     createSelection,
     deleteSelection
}