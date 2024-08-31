const models = require('../models');
const SuggestionForm = models.SuggestionForm
const AssessmentQuestionBank = models.AssessmentQuestionBank
const QuestionBank = models.QuestionBank
const Answer = models.Answer
const FormAssessmentQuestion = models.FormAssessmentQuestion
const FormQuestion = models.FormQuestion
const FormCareer = models.FormCareer
const Career = models.Career
const Track = models.Track
const User = models.User
const SuggestionHistory = models.SuggestionHistory
const QuestionScore = models.QuestionScore
const AssessmentScore = models.AssessmentScore
const CareerScore = models.CareerScore
const TrackSummary = models.TrackSummary
const Recommendation = models.Recommendation

const { sequelize } = require('../models');
const { Op } = require('sequelize');
const Joi = require('joi');

const formAttr = ["id", "title", "desc"]
const questionAttr = ["id", "question", "isMultipleChoice", "desc"]
const answerAttr = ["id", "answer"]
const assesstionAttr = ["id", "question", "desc"]
const careerAttr = ["id", "name_th", "name_en", "image", "track", "desc"]

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
               desc: Joi.alternatives().try(Joi.string().allow(''), Joi.valid(null)),
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
               desc: Joi.alternatives().try(Joi.string().allow(''), Joi.valid(null)),
          })
     ).min(1).required(),
     Careers: Joi.array().items(
          Joi.number().required()
     ).min(1).required()
})
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

const answerSchema = Joi.object({
     questions: Joi.array().items(
          Joi.object({
               qId: Joi.number().required(),
               aId: Joi.number().required(),
          })
     ).min(1).required(),
     assessments: Joi.array().items(
          Joi.object({
               assId: Joi.number().required(),
               index: Joi.number().required(),
          })
     ).min(1).required(),
     careers: Joi.array().items(
          Joi.number().required()
     ).min(1).required()
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

async function checkEquals(values) {
     const requireTrackQ = {}
     const requireTrackA = {}
     const requireTrackC = {}

     const tracks = await Track.findAll({
          attributes: ["track"]
     });

     for (let index = 0; index < tracks.length; index++) {
          const track = tracks[index]?.dataValues?.track;
          requireTrackQ[track] = 0
          requireTrackA[track] = 0
          requireTrackC[track] = 0
     }

     values.Questions.map(question => {
          requireTrackQ[question.track] += 1
     })
     values.Assesstions.map(assessment => {
          requireTrackA[assessment.track] += 1
     })
     for (let index = 0; index < values.Careers.length; index++) {
          const cid = values.Careers[index];
          const career = await Career.findOne({
               where: { id: cid },
               attributes: ["track"]
          })
          const track = career?.dataValues?.track
          requireTrackC[track] += 1
     }

     function analyzeInequality(obj) {
          const values = Object.values(obj);
          const max = Math.max(...values);
          const inequalTracks = [];
          for (let track in obj) {
               if (obj[track] < max) {
                    inequalTracks.push({
                         track: track,
                         difference: max - obj[track],
                    });
               }
          }
          return inequalTracks;
     }

     let message = null;
     let inequalityInfo = {};

     if (!Object.values(requireTrackQ).every(v => v === Object.values(requireTrackQ)[0])) {
          message = "คำถามในแต่ละแทร็กไม่เท่ากัน";
          inequalityInfo.items = analyzeInequality(requireTrackQ);
          inequalityInfo.type = "ข้อ"
     }
     else if (!Object.values(requireTrackA).every(v => v === Object.values(requireTrackA)[0])) {
          message = "แบบประเมินในแต่ละแทร็กไม่เท่ากัน";
          inequalityInfo.items = analyzeInequality(requireTrackA);
          inequalityInfo.type = "ข้อ"
     }
     else if (!Object.values(requireTrackC).every(v => v === Object.values(requireTrackC)[0])) {
          message = "อาชีพในแต่ละแทร็กไม่เท่ากัน";
          inequalityInfo.items = analyzeInequality(requireTrackC);
          inequalityInfo.type = "อาชีพ"
     }
     console.log(requireTrackQ, Object.values(requireTrackQ).every(v => v === Object.values(requireTrackQ)[0]));
     console.log(requireTrackA, Object.values(requireTrackA).every(v => v === Object.values(requireTrackA)[0]));
     console.log(requireTrackC, Object.values(requireTrackC).every(v => v === Object.values(requireTrackC)[0]));
     return { message, inequalityInfo };
}

const createForm = async (req, res) => {
     const createData = req.body;
     const { error, value } = createSuggestFormSchema.validate(createData);
     if (error) {
          return res.status(406).json({
               ok: false,
               message: `${error.details[0].message}`
          });
     }

     const { message: errMessage, inequalityInfo } = await checkEquals(value)
     if (errMessage) {
          return res.status(406).json({
               ok: false,
               message: errMessage,
               inequalityInfo
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
                         track: questionData.track,
                         desc: questionData.desc,
                    }, {
                         where: { id: Number(questionData.id) },
                         transaction: t
                    });
               } else {
                    const newQuestion = await QuestionBank.create({
                         question: questionData.question,
                         track: questionData.track,
                         desc: questionData.desc,
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
                         track: assessmentData.track,
                         desc: assessmentData.desc,
                    }, {
                         where: { id: Number(assessmentData.id) },
                         transaction: t
                    });
               } else {
                    const newAssessmentQuestion = await AssessmentQuestionBank.create({
                         question: assessmentData.question,
                         track: assessmentData.track,
                         desc: assessmentData.desc,
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
const sleep = (milliseconds) => {
     return new Promise(resolve => setTimeout(resolve, milliseconds))
}
const summaryAnswers = async (req, res) => {
     await sleep(2000)
     const answers = req.body;
     const email = req.params.email;
     try {
          const userId = await User.findOne({
               where: { email },
          })
          const { error, value } = answerSchema.validate(answers);
          if (error) {
               return res.status(400).json({
                    ok: false,
                    message: `Validation error: ${error.details[0].message}`
               });
          }

          const result = await sequelize.transaction(async (t) => {
               const suggestionHistory = await SuggestionHistory.create({
                    user_id: userId?.dataValues?.id,
                    totalQuestionScore: 0,
                    overallScore: 0,
                    totalCorrectAnswers: 0,
                    totalQuestions: 0,
                    overallCorrectPercentage: 0,
               }, { transaction: t });

               const tracks = await Track.findAll({ transaction: t });
               const trackScores = tracks.reduce((acc, track) => {
                    acc[track.track] = {
                         questionScore: 0,
                         assessmentScore: 0,
                         careerScore: 0,
                         correctAnswers: 0,
                         totalQuestions: 0
                    };
                    return acc;
               }, {});

               // Process question scores
               const questionScores = await Promise.all(value.questions.map(async (q) => {
                    const question = await QuestionBank.findByPk(q.qId, { transaction: t });
                    const correctAnswer = await Answer.findOne({
                         where: { questionId: q.qId, isCorrect: true },
                         transaction: t
                    });
                    const isCorrect = correctAnswer && correctAnswer?.dataValues?.id === q.aId;
                    const score = isCorrect ? 10 : 0;

                    if (question && question?.dataValues?.track) {
                         const track = question?.dataValues?.track;
                         trackScores[track].questionScore += score;
                         trackScores[track].totalQuestions += 1;
                         if (isCorrect) {
                              trackScores[track].correctAnswers += 1;
                         }
                    }

                    // Store QuestionScore
                    await QuestionScore.create({
                         suggestion_id: suggestionHistory.id,
                         question: question?.dataValues?.question,
                         track: question ? question?.dataValues?.track : null,
                         score: score,
                         isCorrect: isCorrect
                    }, { transaction: t });

                    return {
                         qId: q.qId,
                         question: question?.dataValues?.question,
                         track: question ? question?.dataValues?.track : null,
                         score: score,
                         isCorrect: isCorrect
                    };
               }));

               // Process assessment scores
               const assessmentScores = await Promise.all(value.assessments.map(async (a) => {
                    const assessment = await AssessmentQuestionBank.findByPk(a.assId, { transaction: t });
                    const score = [5, 4, 3, 2, 1, 0][a.index] || 0;

                    if (assessment && assessment?.dataValues?.track) {
                         trackScores[assessment?.dataValues?.track].assessmentScore += score;
                    }

                    // Store AssessmentScore
                    await AssessmentScore.create({
                         suggestion_id: suggestionHistory.id,
                         question: assessment?.dataValues?.question,
                         track: assessment ? assessment?.dataValues?.track : null,
                         score: score
                    }, { transaction: t });

                    return {
                         assId: a.assId,
                         question: assessment?.dataValues?.question,
                         track: assessment ? assessment?.dataValues?.track : null,
                         score: score
                    };
               }));

               // Process career scores
               const careersScores = await Promise.all(value.careers.map(async (careerId) => {
                    const career = await Career.findByPk(careerId, { transaction: t });
                    if (career && career?.dataValues?.track) {
                         trackScores[career?.dataValues?.track].careerScore += 5;
                    }

                    // Store CareerScore
                    await CareerScore.create({
                         suggestion_id: suggestionHistory.id,
                         name_th: career?.dataValues?.name_th,
                         name_en: career?.dataValues?.name_en,
                         track: career?.dataValues?.track || null,
                         score: 5
                    }, { transaction: t });

                    return {
                         name_th: career?.dataValues?.name_th,
                         name_en: career?.dataValues?.name_en,
                         track: career?.dataValues?.track || null,
                         score: 5
                    };
               }));

               // Process track summaries
               const trackSummaries = await Promise.all(Object.entries(trackScores).map(async ([track, scores]) => {
                    const correctPercentage = scores.totalQuestions > 0
                         ? (scores.correctAnswers / scores.totalQuestions * 100).toFixed(2)
                         : 0;
                    const summary = {
                         track,
                         questionScore: scores.questionScore,
                         assessmentScore: scores.assessmentScore,
                         careerScore: scores.careerScore,
                         totalScore: scores.questionScore + scores.assessmentScore + scores.careerScore,
                         correctAnswers: scores.correctAnswers,
                         totalQuestions: scores.totalQuestions,
                         correctPercentage: parseFloat(correctPercentage),
                         summary: `คะแนนแบบทดสอบ ${scores.questionScore} คะแนน, คะแนนแบบประเมิน ${scores.assessmentScore} คะแนน, คะแนนความชอบ ${scores.careerScore} คะแนน, ตอบคำถามถูก ${scores.correctAnswers}/${scores.totalQuestions} ข้อ (${correctPercentage}%).`
                    };

                    // Store TrackSummary
                    await TrackSummary.create({
                         suggestion_id: suggestionHistory.id,
                         ...summary
                    }, { transaction: t });

                    return summary;
               }));

               const sortedTracks = trackSummaries.sort((a, b) => b.totalScore - a.totalScore);
               const topTracks = sortedTracks.slice(0, 3);
               const recommendation = await Promise.all(topTracks.map(async (track, index) => {
                    let strength = index === 0 ? "เหมาะสมมาก" : index === 1 ? "ค่อนข้างเหมาะสม" : "ทำได้ดี";
                    const rec = {
                         track: track.track,
                         recText: `คุณ${strength}กับแทร็ก ${track.track}`,
                         descText: `คะแนนรวมของคุณคือ ${track.totalScore} คะแนน, ${track.summary}`
                    };

                    // Store Recommendation
                    await Recommendation.create({
                         suggestion_id: suggestionHistory.id,
                         ...rec
                    }, { transaction: t });

                    return rec;
               }));

               const totalQuestionScore = questionScores.reduce((sum, q) => sum + q.score, 0);
               const totalAssessmentScore = assessmentScores.reduce((sum, a) => sum + a.score, 0);
               const totalCareerScore = Object.values(trackScores).reduce((sum, scores) => sum + scores.careerScore, 0);
               const overallScore = totalQuestionScore + totalAssessmentScore + totalCareerScore;

               const totalCorrectAnswers = Object.values(trackScores).reduce((sum, scores) => sum + scores.correctAnswers, 0);
               const totalQuestions = Object.values(trackScores).reduce((sum, scores) => sum + scores.totalQuestions, 0);
               const overallCorrectPercentage = totalQuestions > 0
                    ? parseFloat((totalCorrectAnswers / totalQuestions * 100).toFixed(2))
                    : 0;

               // Update SuggestionHistory
               await suggestionHistory.update({
                    totalQuestionScore,
                    overallScore,
                    totalCorrectAnswers,
                    totalQuestions,
                    overallCorrectPercentage
               }, { transaction: t });

               return {
                    questionScores,
                    assessmentScores,
                    trackSummaries,
                    careersScores,
                    totalQuestionScore,
                    overallScore,
                    totalCorrectAnswers,
                    totalQuestions,
                    overallCorrectPercentage,
                    recommendation
               };
          });

          return res.status(200).json({
               ok: true,
               data: result,
               message: "Answer summary processed and stored successfully"
          });
     } catch (error) {
          console.error(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          });
     }
};

const getSummaryHistoryByEmail = async (req, res) => {
     try {
          const { email } = req.params;
          const user = await User.findOne({
               where: { email },
          });
          if (!user) {
               return res.status(404).json({
                    ok: false,
                    message: "User not found"
               });
          }

          const summaryHistories = await SuggestionHistory.findAll({
               where: { user_id: user?.dataValues?.id },
               include: [
                    {
                         model: QuestionScore,
                         as: 'questionScores',
                         include: [{ model: Track, as: 'trackInfo' }]
                    },
                    {
                         model: AssessmentScore,
                         as: 'assessmentScores',
                         include: [{ model: Track, as: 'trackInfo' }]
                    },
                    {
                         model: CareerScore,
                         as: 'careerScores',
                         include: [{ model: Track, as: 'trackInfo' }]
                    },
                    {
                         model: TrackSummary,
                         as: 'trackSummaries',
                         include: [{ model: Track, as: 'trackInfo' }]
                    },
                    {
                         model: Recommendation,
                         as: 'recommendations',
                         include: [{ model: Track, as: 'trackInfo' }]
                    }
               ],
               order: [['createdAt', 'DESC']]
          });

          const processedHistories = summaryHistories.map(history => ({
               id: history?.dataValues?.id,
               createdAt: history?.dataValues?.createdAt,
               totalQuestionScore: history?.dataValues?.totalQuestionScore,
               overallScore: history?.dataValues?.overallScore,
               totalCorrectAnswers: history?.dataValues?.totalCorrectAnswers,
               totalQuestions: history?.dataValues?.totalQuestions,
               overallCorrectPercentage: history?.dataValues?.overallCorrectPercentage,
               questionScores: history?.dataValues?.questionScores.map(qs => ({
                    question: qs?.dataValues?.question,
                    track: qs?.dataValues?.track,
                    score: qs?.dataValues?.score,
                    isCorrect: qs?.dataValues?.isCorrect
               })),
               assessmentScores: history?.dataValues?.assessmentScores.map(as => ({
                    question: as?.dataValues?.question,
                    track: as?.dataValues?.track,
                    score: as?.dataValues?.score
               })),
               careerScores: history?.dataValues?.careerScores.map(cs => ({
                    name_th: cs?.dataValues?.name_th,
                    name_en: cs?.dataValues?.name_en,
                    track: cs?.dataValues?.track,
                    score: cs?.dataValues?.score
               })),
               trackSummaries: history?.dataValues?.trackSummaries.map(ts => ({
                    track: ts?.dataValues?.track,
                    questionScore: ts?.dataValues?.questionScore,
                    assessmentScore: ts?.dataValues?.assessmentScore,
                    careerScore: ts?.dataValues?.careerScore,
                    totalScore: ts?.dataValues?.totalScore,
                    correctAnswers: ts?.dataValues?.correctAnswers,
                    totalQuestions: ts?.dataValues?.totalQuestions,
                    correctPercentage: ts?.dataValues?.correctPercentage,
                    summary: ts?.dataValues?.summary
               })),
               recommendations: history?.dataValues?.recommendations.map(r => ({
                    track: r?.dataValues?.track,
                    recText: r?.dataValues?.recText,
                    descText: r?.dataValues?.descText
               }))
          }));

          return res.status(200).json({
               ok: true,
               data: processedHistories,
               message: "Summary history retrieved successfully"
          });
     } catch (error) {
          console.error(error);
          return res.status(500).json({
               ok: false,
               message: "Server error while fetching summary history."
          });
     }
};

const getSummaryHistoryDetailByID = async (req, res) => {
     const id = req.params.id
     try {
          const data = await SuggestionHistory.findOne({
               where: { id },
               include: [
                    {
                         model: QuestionScore,
                         as: 'questionScores',
                         include: [{ model: Track, as: 'trackInfo' }]
                    },
                    {
                         model: AssessmentScore,
                         as: 'assessmentScores',
                         include: [{ model: Track, as: 'trackInfo' }]
                    },
                    {
                         model: CareerScore,
                         as: 'careerScores',
                         include: [{ model: Track, as: 'trackInfo' }]
                    },
                    {
                         model: TrackSummary,
                         as: 'trackSummaries',
                         include: [{ model: Track, as: 'trackInfo' }]
                    },
                    {
                         model: Recommendation,
                         as: 'recommendations',
                         include: [{ model: Track, as: 'trackInfo' }]
                    }
               ],
               order: [['createdAt', 'DESC']]
          });
          data.dataValues.careersScores = data.careerScores
          data.dataValues.recommendation = data.recommendations
          delete data.dataValues.careerScores
          delete data.dataValues.recommendations
          return res.status(200).json({
               ok: true,
               data,
               message: "Summary history retrieved successfully"
          });
     } catch (error) {
          console.error(error);
          return res.status(500).json({
               ok: false,
               message: "Server error while fetching summary history."
          });
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
     summaryAnswers,
     getSummaryHistoryByEmail,
     getSummaryHistoryDetailByID
}