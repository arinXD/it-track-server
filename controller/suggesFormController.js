const models = require('../models');
const SuggestionForm = models.SuggestionForm
const AssessmentQuestionBank = models.AssessmentQuestionBank
const QuestionBank = models.QuestionBank
const Answer = models.Answer
const FormAssessmentQuestion = models.FormAssessmentQuestion
const FormQuestion = models.FormQuestion
const FormCareer = models.FormCareer
const Career = models.Career
const { sequelize } = require('../models');
const { Op } = require('sequelize');
const Joi = require('joi');

const formAttr = ["id", "title", "desc"]
const questionAttr = ["id", "question", "isMultipleChoice",]
const answerAttr = ["id", "answer"]
const assesstionAttr = ["id", "question",]
const careerAttr = ["id", "name_th", "name_en", "image", "track",]

const createSuggestFormSchema = Joi.object({
     id: Joi.alternatives().try(Joi.valid(null), Joi.number()),
     title: Joi.string().required(),
     desc: Joi.string().required(),
     Questions: Joi.array().items(
          Joi.object({
               id: Joi.alternatives().try(Joi.string(), Joi.number(), Joi.valid(null)).required(),
               question: Joi.string().required(),
               isEnable: Joi.boolean().required(),
               isMultipleChoice: Joi.boolean(),
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
          const suggestForms = await SuggestionForm.findAll({
               order: [
                    ['id', 'DESC'],
               ]
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
     const shuffleArray = (array) => {
          for (let i = array.length - 1; i > 0; i--) {
               const j = Math.floor(Math.random() * (i + 1));
               console.log(j);
               [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
     }
     try {
          const suggestForms = await SuggestionForm.findOne({
               where: {
                    isAvailable: true
               },
               attributes: formAttr,
               include: [
                    {
                         model: FormQuestion,
                         where: {
                              isEnable: true
                         },
                         include: {
                              model: QuestionBank,
                              attributes: questionAttr,
                              include: {
                                   model: Answer,
                                   attributes: answerAttr,
                              }
                         }
                    },
                    {
                         model: FormAssessmentQuestion,
                         where: {
                              isEnable: true
                         },
                         include: {
                              model: AssessmentQuestionBank,
                              attributes: assesstionAttr,
                         }
                    },
                    {
                         model: FormCareer,
                         include: {
                              model: Career,
                              attributes: careerAttr,
                         }
                    },
               ]
          })
          const formatFormData = suggestForms.dataValues

          formatFormData.Questions = shuffleArray(formatFormData?.FormQuestions.map(fq => {
               const question = fq?.QuestionBank;
               if (question.Answers) {
                    question.Answers = shuffleArray(question.Answers);
               }
               return question;
          }));
          formatFormData.Assessments = shuffleArray(formatFormData?.FormAssessmentQuestions.map(fq => fq?.AssessmentQuestionBank));
          formatFormData.Careers = shuffleArray(formatFormData?.FormCareers.map(fq => fq?.Career));

          delete formatFormData.FormQuestions
          delete formatFormData.FormAssessmentQuestions
          delete formatFormData.FormCareers

          return res.status(200).json({
               ok: true,
               data: formatFormData
          })
     } catch (error) {
          console.log(error);
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
          let form;
          if (value.id) {
               await SuggestionForm.update(
                    {
                         title: value.title,
                         desc: value.desc,
                    },
                    {
                         where: {
                              id: value.id,
                         },
                    },
                    { transaction: t });
               form = { id: value.id }
          } else {
               form = await SuggestionForm.create({
                    title: value.title,
                    desc: value.desc,
                    isAvailable: false
               }, { transaction: t });
          }

          //   Questions, Answers
          for (const questionData of value.Questions) {
               if (!isNaN(Number(questionData.id))) {
                    await QuestionBank.update({
                         question: questionData.question,
                         track: questionData.track
                    }, {
                         where: { id: Number(questionData.id) },
                         transaction: t
                    });
               } else {
                    const newQuestion = await QuestionBank.create({
                         question: questionData.question,
                         track: questionData.track
                    }, { transaction: t });
                    questionData.id = newQuestion?.dataValues?.id
               }

               const existingFormQuestion = await FormQuestion.findOne({
                    where: {
                         formId: form.id,
                         questionId: questionData.id
                    },
                    transaction: t
               });

               if (existingFormQuestion) {
                    await existingFormQuestion.update({
                         isEnable: questionData.isEnable
                    }, { transaction: t });
               } else {
                    await FormQuestion.create({
                         formId: form.id,
                         questionId: questionData.id,
                         isEnable: questionData.isEnable
                    }, { transaction: t });
               }

               //   Answers
               for (const answerData of questionData.Answers) {
                    if (!isNaN(Number(answerData.id))) {
                         await Answer.update({
                              answer: answerData.answer,
                              isCorrect: answerData.isCorrect,
                              questionId: questionData.id,
                         }, {
                              where: { id: Number(answerData.id) },
                              transaction: t
                         });
                    } else {
                         await Answer.create({
                              answer: answerData.answer,
                              isCorrect: answerData.isCorrect,
                              questionId: questionData.id,
                         }, { transaction: t });
                    }
               }
          }

          const existingFormQuestions = await FormQuestion.findAll({
               where: {
                    formId: form.id
               },
               transaction: t
          });
          const currentQuestionIds = value.Questions.map(q => q.id);
          const formQuestionsToRemove = existingFormQuestions.filter(fq =>
               !currentQuestionIds.includes(fq.questionId)
          );
          for (const fqToRemove of formQuestionsToRemove) {
               await fqToRemove.destroy({ transaction: t });
          }

          //   Assessment
          for (const assessmentData of value.Assesstions) {
               if (!isNaN(Number(assessmentData.id))) {
                    await AssessmentQuestionBank.update({
                         question: assessmentData.question,
                         track: assessmentData.track
                    }, {
                         where: { id: Number(assessmentData.id) },
                         transaction: t
                    });
               } else {
                    const newAssessmentQuestion = await AssessmentQuestionBank.create({
                         question: assessmentData.question,
                         track: assessmentData.track
                    }, { transaction: t });

                    assessmentData.id = newAssessmentQuestion?.dataValues?.id;
               }

               const existingFormAssessmentQuestion = await FormAssessmentQuestion.findOne({
                    where: {
                         formId: form.id,
                         assessmentQuestionId: Number(assessmentData.id)
                    },
                    transaction: t
               });

               if (existingFormAssessmentQuestion) {
                    await existingFormAssessmentQuestion.update({
                         isEnable: assessmentData.isEnable
                    }, { transaction: t });
               } else {
                    await FormAssessmentQuestion.create({
                         formId: form.id,
                         assessmentQuestionId: Number(assessmentData.id),
                         isEnable: assessmentData.isEnable
                    }, { transaction: t });
               }
          }
          const existingFormAssessmentQuestions = await FormAssessmentQuestion.findAll({
               where: {
                    formId: form.id
               },
               transaction: t
          });

          const currentAssessmentIds = value.Assesstions.map(a => Number(a.id));

          const formAssessmentQuestionsToRemove = existingFormAssessmentQuestions.filter(faq =>
               !currentAssessmentIds.includes(faq.assessmentQuestionId)
          );

          for (const faqToRemove of formAssessmentQuestionsToRemove) {
               await faqToRemove.destroy({ transaction: t });
          }

          //   Career
          for (const careerId of value.Careers) {
               const existingFormCareer = await FormCareer.findOne({
                    where: {
                         formId: form.id,
                         careerId: careerId
                    },
                    transaction: t
               });

               if (!existingFormCareer) {
                    await FormCareer.create({
                         formId: form.id,
                         careerId: careerId
                    }, { transaction: t });
               }
          }
          const existingFormCareers = await FormCareer.findAll({
               where: {
                    formId: form.id
               },
               transaction: t
          });

          const currentCareerIds = value.Careers;

          const formCareersToRemove = existingFormCareers.filter(fc =>
               !currentCareerIds.includes(fc.careerId)
          );

          for (const fcToRemove of formCareersToRemove) {
               await fcToRemove.destroy({ transaction: t });
          }


          await t.commit();
          // await t.rollback();

          return res.status(200).json({
               ok: true,
               message: "Suggestion form created successfully",
               data: form
          });
     } catch (error) {
          console.log(error);
          await t.rollback();
          return res.status(500).json({
               ok: false,
               message: "Server error while creating the form.",
               data: req.body
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

          const updatedForm = await SuggestionForm.findOne({
               where: { id: formId },
          });

          updatedForm.isAvailable = !updatedForm?.dataValues?.isAvailable;
          await updatedForm.save({ transaction });

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
               message: "ลบแบบฟอร์มสำเร็จ"
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