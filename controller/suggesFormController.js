const models = require('../models');
const SuggestionForm = models.SuggestionForm
const AssessmentQuestionBank = models.AssessmentQuestionBank
const QuestionBank = models.QuestionBank
const Answer = models.Answer
const FormAssessmentQuestion = models.FormAssessmentQuestion
const FormQuestion = models.FormQuestion
const FormCareer = models.FormCareer
const { sequelize } = require('../models');
const { Op } = require('sequelize');
const Joi = require('joi');

const createSuggestFormSchema = Joi.object({
     title: Joi.string().required(),
     desc: Joi.string().required(),
     Questions: Joi.array().items(
          Joi.object({
               id: Joi.alternatives().try(Joi.string(), Joi.number(), Joi.valid(null)).required(),
               question: Joi.string().required(),
               isEnable: Joi.boolean().required(),
               track: Joi.string().valid('BIT', 'Web and Mobile', 'Network').required(),
               Answers: Joi.array().items(
                    Joi.object({
                         id: Joi.alternatives().try(Joi.string(), Joi.number(), Joi.valid(null)).required(),
                         answer: Joi.string().required(),
                         isCorrect: Joi.boolean()
                    })
               ).min(1).required()
          })
     ).min(1).required(),
     Assesstions: Joi.array().items(
          Joi.object({
               id: Joi.alternatives().try(Joi.string(), Joi.number(), Joi.valid(null)).required(),
               question: Joi.string().required(),
               track: Joi.string().valid('BIT', 'Web and Mobile', 'Network').required(),
               isEnable: Joi.boolean().required(),
          })
     ).min(1).required(),
     Careers: Joi.array().items(
          Joi.number().required()
     ).min(1).required()
});

const createFormQuestionSchema = Joi.object({
     formId: Joi.number().required(),
     questionId: Joi.number().required(),
     isEnable: Joi.boolean(),
});
const createFormAssessmentSchema = Joi.object({
     formId: Joi.number().required(),
     assessmentQuestionId: Joi.number().required(),
     isEnable: Joi.boolean(),
});


const getForms = async (req, res) => {
     try {
          const suggestForms = await SuggestionForm.findAll()
          return res.status(200).json({
               ok: true,
               data: suggestForms
          })
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const getFormByID = async (req, res) => {
     const id = req.params.id
     try {
          const suggestForms = await SuggestionForm.findOne({
               where: { id }
          })
          return res.status(200).json({
               ok: true,
               data: suggestForms
          })
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const getAvailableForm = async (req, res) => {
     try {
          const suggestForms = await SuggestionForm.findOne({
               where: {
                    isAvailable: true
               }
          })
          return res.status(200).json({
               ok: true,
               data: suggestForms
          })
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const getDeletedForms = async (req, res) => {
     try {
          const suggestForms = await SuggestionForm.findAll({
               paranoid: false,
               where: {
                    deletedAt: {
                         [Op.not]: null
                    }
               },
          })
          return res.status(200).json({
               ok: true,
               data: suggestForms
          })
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const createForm = async (req, res) => {
     const createData = req.body;
     const { error, value } = createSuggestFormSchema.validate(createData);

     if (error) {
          return res.status(400).json({
               ok: false,
               message: `Validation error: ${error.details[0].message}`
          });
     }

     const t = await sequelize.transaction();

     try {
          //   SuggestionForm
          const form = await SuggestionForm.create({
               title: value.title,
               desc: value.desc,
               isAvailable: false
          }, { transaction: t });

          //   Questions, Answers
          for (const questionData of value.Questions) {
               let question;
               if (!isNaN(Number(questionData.id))) {
                    //   Existing question
                    [question] = await QuestionBank.update({
                         question: questionData.question,
                         track: questionData.track
                    }, {
                         where: { id: Number(questionData.id) },
                         returning: true,
                         transaction: t
                    });

                    if (!question) {
                         question = await QuestionBank.create({
                              question: questionData.question,
                              track: questionData.track
                         }, { transaction: t });
                    }
               } else {
                    //   Create new question
                    question = await QuestionBank.create({
                         question: questionData.question,
                         track: questionData.track
                    }, { transaction: t });
               }

               // console.log(question?.dataValues);

               await FormQuestion.create({
                    formId: form.id,
                    questionId: question?.dataValues?.id,
                    isEnable: questionData.isEnable
               }, { transaction: t });

               //   Answers
               for (const answerData of questionData.Answers) {
                    if (!isNaN(Number(answerData.id))) {
                         //   Eexisting answer
                         const [updatedRows] = await Answer.update({
                              answer: answerData.answer,
                              isCorrect: answerData.isCorrect,
                              questionId: question?.dataValues?.id,
                         }, {
                              where: { id: Number(answerData.id) },
                              transaction: t
                         });

                         if (updatedRows === 0) {
                              await Answer.create({
                                   answer: answerData.answer,
                                   isCorrect: answerData.isCorrect,
                                   questionId: question?.dataValues?.id,
                              }, { transaction: t });
                         }
                    } else {
                         // Create new answer
                         await Answer.create({
                              answer: answerData.answer,
                              isCorrect: answerData.isCorrect,
                              questionId: question?.dataValues?.id,
                         }, { transaction: t });
                    }
               }
          }

          //   Assessment
          for (const assessmentData of value.Assesstions) {
               if (!isNaN(Number(assessmentData.id))) {
                    //   Existing assessment
                    await AssessmentQuestionBank.update({
                         question: assessmentData.question,
                         track: assessmentData.track
                    }, {
                         where: { id: Number(assessmentData.id) },
                         transaction: t
                    });
               } else {
                    //   Create new assessment
                    const newAssessmentQuestion = await AssessmentQuestionBank.create({
                         question: assessmentData.question,
                         track: assessmentData.track
                    }, { transaction: t });

                    assessmentData.id = newAssessmentQuestion?.dataValues?.id;
               }

               await FormAssessmentQuestion.create({
                    formId: form.id,
                    assessmentQuestionId: Number(assessmentData.id),
                    isEnable: assessmentData.isEnable
               }, { transaction: t });
          }

          //   Career
          for (const careerId of value.Careers) {
               await FormCareer.create({
                    formId: form.id,
                    careerId: careerId
               }, { transaction: t });
          }

          await t.commit();

          return res.status(200).json({
               ok: true,
               message: "Suggestion form created successfully",
               data: form
          });
     } catch (error) {
          await t.rollback();
          console.error("Error creating form:", error);
          return res.status(500).json({
               ok: false,
               message: "Server error while creating the form."
          });
     }
};

const insertQuestionsToForm = async (req, res) => {
     const createData = req.body
     const { error, value } = createFormQuestionSchema.validate(createData);

     if (error) {
          return res.status(400).json({
               ok: false,
               message: `Validation error: ${error.details[0].message}`
          });
     }

     try {
          const form = await FormQuestion.create(value)
          return res.status(200).json({
               ok: true,
               data: form
          })
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}
const insertAssessmentsToForm = async (req, res) => {
     const createData = req.body
     const { error, value } = createFormAssessmentSchema.validate(createData);

     if (error) {
          return res.status(400).json({
               ok: false,
               message: `Validation error: ${error.details[0].message}`
          });
     }

     try {
          const form = await FormAssessmentQuestion.create(value)
          return res.status(200).json({
               ok: true,
               data: form
          })
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const updateForm = async (req, res) => {

}

const availableForm = async (req, res) => {
     const formId = req.params.id;
     let transaction
     try {
          transaction = await models.sequelize.transaction();

          const updatedForm = await SuggestionForm.update(
               { isAvailable: true },
               {
                    where: { id: formId },
                    returning: true,
                    transaction
               }
          );

          if (!updatedForm) {
               await transaction.rollback();
               return res.status(404).json({ message: 'Form not found.' });
          }

          await SuggestionForm.update(
               { isAvailable: false },
               {
                    where: {
                         id: { [Op.ne]: formId }
                    },
                    transaction
               }
          );

          await transaction.commit();

          return res.status(200).json({ message: 'Form availability updated.', form: updatedForm });

     } catch (error) {
          if (transaction) await transaction.rollback();

          console.error(error);
          return res.status(500).json({ message: 'Internal server error.' });
     }
};

const deleteForms = async (forms, force = false) => {
     for (let index = 0; index < forms.length; index++) {
          const id = forms[index];
          await SuggestionForm.destroy({
               where: {
                    id,
               },
               force
          })
     }
}

const deleteMultiple = async (req, res) => {
     const forms = req.body
     try {
          await deleteForms(forms, false)
          return res.status(200).json({
               ok: true,
               data: "ลบแบบฟอร์มสำเร็จ"
          })
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const forceDeleteMultiple = async (req, res) => {
     const forms = req.body
     try {
          await deleteForms(forms, true)
          return res.status(200).json({
               ok: true,
               data: "ลบแบบฟอร์มสำเร็จ"
          })
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

module.exports = {
     getForms,
     getFormByID,
     getAvailableForm,
     getDeletedForms,
     createForm,
     insertQuestionsToForm,
     insertAssessmentsToForm,
     updateForm,
     availableForm,
     deleteMultiple,
     forceDeleteMultiple,
}