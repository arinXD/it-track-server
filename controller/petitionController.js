const { Op } = require('sequelize');
const models = require('../models');
const { sequelize } = models;
const TrackPetition = models.TrackPetition
const User = models.User
const Track = models.Track
const Student = models.Student
const Teacher = models.Teacher
const Selection = models.Selection
const Joi = require('joi');

const createPetition = Joi.object({
     title: Joi.string().required(),
     detail: Joi.string().required(),
     senderEmail: Joi.string().email().required(),
     oldTrack: Joi.string().valid('BIT', 'Web and Mobile', 'Network').required(),
     newTrack: Joi.string().valid('BIT', 'Web and Mobile', 'Network').required(),
});
const updatePetition = Joi.object({
     title: Joi.string().required(),
     detail: Joi.string().required(),
});
const petitionStatus = Joi.string().valid('all', 'approved', 'rejected').required()

const userAttr = ["id", "email"]
const petitionAttr = ["id", "title", "detail", "status", "oldTrack", "newTrack", "createdAt",]
const studentAttr = ["stu_id", "email", "first_name", "last_name", "courses_type", "program", "acadyear"]

const getPetitionByStatus = async (req, res) => {
     const status = req.params.status
     const { error, value } = petitionStatus.validate(status);
     if (error) {
          return res.status(406).json({
               ok: false,
               message: `${error.details[0].message}`
          });
     }

     const statuses = {
          'all': 0,
          'approved': 1,
          'rejected': 2
     }
     const findStatus = statuses[status] || statuses.all
     try {
          const petition = await TrackPetition.findAll({
               where: {
                    status: findStatus
               },
               order: [
                    ["id", "desc"]
               ],
               attributes: petitionAttr,
               include: [
                    {
                         model: User,
                         attributes: userAttr,
                         as: 'Sender',
                         include: [
                              {
                                   model: Student,
                                   attributes: studentAttr,
                              }
                         ]
                    },
                    {
                         model: User,
                         attributes: userAttr,
                         as: 'Approver',
                         include: [
                              {
                                   model: Teacher,
                              }
                         ]
                    },
               ]
          })

          return res.status(200).json({
               ok: true,
               data: petition,
               findStatus
          })
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const getPetitionById = async (req, res) => {
     const id = req.params.id
     try {
          const petition = await TrackPetition.findOne({
               where: {
                    id
               },
               paranoid: false,
               attributes: petitionAttr,
               include: [
                    {
                         model: User,
                         as: 'Sender',
                         include: [
                              {
                                   model: Student,
                                   attributes: studentAttr
                              }
                         ]
                    },
                    {
                         model: User,
                         attributes: userAttr,
                         as: 'Approver',
                         include: [
                              {
                                   model: Teacher,
                              }
                         ]
                    },
               ]
          })
          return res.status(200).json({
               ok: true,
               data: petition
          })
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const getPetitionByEmail = async (req, res) => {
     const email = req.params.email
     try {
          const petition = await TrackPetition.findAll({
               attributes: petitionAttr,
               order: [
                    ["id", "desc"]
               ],
               include: [
                    {
                         model: User,
                         attributes: userAttr,
                         as: 'Sender',
                         where: {
                              email: email
                         },
                         attributes: ['email']
                    },
                    {
                         model: User,
                         attributes: userAttr,
                         as: 'Approver',
                         include: [
                              {
                                   model: Teacher,
                              }
                         ]
                    },
               ]
          })
          return res.status(200).json({
               ok: true,
               data: petition
          })
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const getDeletedPetitionByEmail = async (req, res) => {
     const email = req.params.email
     try {
          const petition = await TrackPetition.findAll({
               order: [
                    ["id", "desc"]
               ],
               where: {
                    deletedAt: {
                         [Op.ne]: null
                    }
               },
               include: [
                    {
                         model: User,
                         attributes: userAttr,
                         as: 'Sender',
                         where: {
                              email: email
                         },
                         attributes: ['email']
                    },
                    {
                         model: User,
                         attributes: userAttr,
                         as: 'Approver',
                         include: [
                              {
                                   model: Teacher,
                              }
                         ]
                    },
               ],
               paranoid: false
          })
          return res.status(200).json({
               ok: true,
               data: petition
          })
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const sendPetition = async (req, res) => {
     const createData = req.body;
     const { error, value } = createPetition.validate(createData);


     if (error) {
          return res.status(406).json({
               ok: false,
               message: `${error.details[0].message}`
          });
     }

     try {
          const user = await User.findOne({
               where: {
                    email: value.senderEmail
               },
               include: [
                    {
                         model: Student,
                    }
               ]
          })
          const stu_id = user?.dataValues?.Student?.dataValues?.stu_id
          if (stu_id) {
               const trackSelected = await Selection.findOne({
                    where: {
                         stu_id: stu_id
                    }
               })
               if (trackSelected) {
                    value.senderId = user?.dataValues.id
                    const createdPetition = await TrackPetition.create(value);
                    return res.status(200).json({
                         ok: true,
                         data: createdPetition
                    })
               } else {
                    return res.status(406).json({
                         ok: false,
                         message: `จำเป็นต้องเลือกแทร็กก่อนยื่นคำร้อง`
                    });
               }
          } else {
               return res.status(406).json({
                    ok: false,
                    message: `ไม่พบข้อมูลนักศึกษา`
               });
          }
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const editPetition = async (req, res) => {
     const id = req.params.id;
     const updateData = req.body
     const { error, value } = updatePetition.validate(updateData);

     if (error) {
          return res.status(406).json({
               ok: false,
               message: `${error.details[0].message}`
          });
     }

     try {
          const updatePetition = await TrackPetition.update(value,
               {
                    where: {
                         id
                    },
               },
          );
          return res.status(200).json({
               ok: true,
               data: updatePetition
          })
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

async function removePetition(force, id) {
     await TrackPetition.destroy(
          {
               where: {
                    id
               },
               force
          },
     );
}
const softDeletePetition = async (req, res) => {
     const arrayId = req.body;
     try {
          for (let index = 0; index < arrayId.length; index++) {
               const id = arrayId[index];
               await removePetition(false, id)
          }
          return res.status(200).json({
               ok: true,
               message: "deleted petition successfully."
          })
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}
const deletePetition = async (req, res) => {
     const arrayId = req.body;
     try {
          for (let index = 0; index < arrayId.length; index++) {
               const id = arrayId[index];
               await removePetition(true, id)
          }
          return res.status(200).json({
               ok: true,
               message: "deleted petition successfully."
          })
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}
const retrievePetition = async (req, res) => {
     const arrayId = req.body;
     try {
          for (let index = 0; index < arrayId.length; index++) {
               const id = arrayId[index];
               await TrackPetition.restore({
                    where: {
                         id: arrayId
                    }
               });
          }
          return res.status(200).json({
               ok: true,
               message: "retrieved petition successfully."
          })
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const approvePetition = async (req, res) => {
     const { pid, email, status } = req.params;
     const { error } = Joi.number().valid(1, 2).required().validate(status)
     if (error) {
          return res.status(406).json({
               ok: false,
               message: `${error.details[0].message}`
          });
     }
     const statuses = {
          "1": "ยืนยันคำร้องย้ายแทร็ก",
          "2": "ปฏิเสธคำร้องย้ายแทร็ก"
     }

     try {
          const approver = await User.findOne({
               where: { email },
               attributes: ["id"]
          });

          if (!approver) {
               return res.status(406).json({
                    ok: false,
                    message: "Approver not found."
               });
          }

          let result
          // approved petition
          if (status == "1") {
               const transaction = await sequelize.transaction();
               const petition = await TrackPetition.findOne({
                    where: { id: pid },
                    include: [
                         {
                              model: User,
                              attributes: userAttr,
                              as: 'Sender',
                              required: false,
                              include: [
                                   {
                                        model: Student,
                                        attributes: ["stu_id"]
                                   }
                              ]
                         },
                    ],
               })
               if (petition?.dataValues?.status !== 0) {
                    return res.status(406).json({
                         ok: false,
                         message: "คำขอนี้ถูกตอบรับแล้ว"
                    });
               }
               result = petition
               petition.status = status
               petition.approver = approver?.dataValues.id
               await petition.save({ transaction });
               await Selection.update({
                    result: petition?.dataValues?.newTrack
               }, {
                    where: {
                         stu_id: petition?.dataValues?.Sender?.dataValues?.Student?.stu_id
                    }
               }, { transaction })
               await transaction.commit()
          }
          // rejected petition 
          else {
               const updateCount = await TrackPetition.update(
                    {
                         status,
                         approver: approver?.dataValues.id,
                    },
                    {
                         where: { id: pid },
                         returning: true,
                    }
               );
               if (updateCount === 0) {
                    return res.status(406).json({
                         ok: false,
                         message: "Petition not found or not updated."
                    });
               }
          }

          return res.status(200).json({
               ok: true,
               message: statuses[status],
          });
     } catch (error) {
          console.error(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          });
     }
};

module.exports = {
     getPetitionById,
     getPetitionByStatus,
     getPetitionByEmail,
     getDeletedPetitionByEmail,
     sendPetition,
     editPetition,
     softDeletePetition,
     deletePetition,
     retrievePetition,
     approvePetition
}