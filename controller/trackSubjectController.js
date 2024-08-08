const models = require('../models');
const { findSubjectByCode } = require('../utils/subject');
const { Op } = require('sequelize');
const TrackSubject = models.TrackSubject;
const TrackSelection = models.TrackSelection;
const Selection = models.Selection;
const SelectionDetail = models.SelectionDetail;
const Enrollment = models.Enrollment;

const createSubjectInTrack = async (req, res) => {
     const track_selection_id = req.params.id;
     const subjects = req.body;
     try {
          const trackSelection = await TrackSelection.findByPk(track_selection_id);
          if (!trackSelection) {
               return res.status(404).json({
                    ok: false,
                    message: "Track selection not found"
               });
          }

          for (const subject_id of subjects) {
               if (!subject_id) continue;
               const findSubject = await TrackSubject.findOne({
                    where: {
                         track_selection_id,
                         subject_id,
                    }
               });

               if (findSubject?.id) continue;

               await TrackSubject.create({
                    track_selection_id,
                    subject_id
               });

               const selections = await Selection.findAll({
                    where: { track_selection_id }
               });

               for (const selection of selections) {

                    const existingSelectionDetail = await SelectionDetail.findOne({
                         where: {
                              selection_id: selection?.dataValues?.id,
                              subject_id
                         }
                    });

                    if (!existingSelectionDetail) {
                         const enrollment = await Enrollment.findOne({
                              where: {
                                   stu_id: selection?.dataValues?.stu_id,
                                   subject_id
                              }
                         });
                         await SelectionDetail.create({
                              selection_id: selection?.dataValues?.id,
                              subject_id,
                              grade: enrollment?.dataValues?.grade || null
                         });
                    }
               }
          }

          return res.status(201).json({
               ok: true,
               message: "เพิ่มวิชาสำเร็จ"
          });
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               ok: false,
               message: "เพิ่มวิชาไม่สำเร็จ"
          });
     }
};

const deleteSubjectInTrack = async (req, res) => {
     const track_selection_id = req.params.id;
     const subjects = req.body;
     try {
          for (const subject of subjects) {
               const subject_id = await findSubjectByCode(subject);

               await TrackSubject.destroy({
                    where: {
                         [Op.and]: [{ track_selection_id }, { subject_id }]
                    },
                    force: true
               });

               const selections = await Selection.findAll({
                    where: { track_selection_id }
               });

               for (const selection of selections) {
                    await SelectionDetail.destroy({
                         where: {
                              selection_id: selection?.dataValues?.id,
                              subject_id
                         },
                         force: true
                    });
               }
          }

          return res.status(200).json({
               ok: true,
               message: "ลบวิชาสำเร็จ"
          });
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               ok: false,
               message: "ลบวิชาไม่สำเร็จ"
          });
     }
};

module.exports = {
     createSubjectInTrack,
     deleteSubjectInTrack
};