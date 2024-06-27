const models = require('../models');
const QuestionBank = models.QuestionBank
const Answer = models.Answer
const FormQuestion = models.FormQuestion
const { Op } = require('sequelize');
const Joi = require('joi');

const defaultQuestionAttr = ["id", "question", "isMultipleChoice", "track"]
const defaultAnswerAttr = ["id", "answer", "isCorrect"]

const createQuestionSchema = Joi.object({
     question: Joi.string().required(),
     track: Joi.string().valid('BIT', 'Web and Mobile', 'Network').required(),
     Answers: Joi.array().items(
          Joi.object({
               answer: Joi.string().required(),
               isCorrect: Joi.boolean()
          })
     ).min(1).required()
});

const getAllQuestion = async (req, res) => {
     try {
          const questions = await QuestionBank.findAll({
               attributes: defaultQuestionAttr,
               include: [
                    {
                         model: Answer,
                         attributes: defaultAnswerAttr,
                    },
               ]
          })
          return res.status(200).json({
               ok: true,
               data: questions
          })
     } catch (error) {
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const getQuestionsNotInForm = async (req, res) => {
     const formId = req.params.id
     try {
          const formQuestions = await FormQuestion.findAll({
               attributes: ['questionId'],
               where: { formId }
          });
          const questionIdsInForm = formQuestions.map(fq => fq?.dataValues?.questionId);

          const questions = await QuestionBank.findAll({
               where: {
                    id: {
                         [Op.notIn]: questionIdsInForm
                    }
               },
               attributes: defaultQuestionAttr,
               include: [
                    {
                         model: Answer,
                         attributes: defaultAnswerAttr,
                    },
               ]
          });
          return res.status(200).json({
               ok: true,
               data: questions
          })
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const getQuestionsInForm = async (req, res) => {
     const formId = req.params.id
     try {
          let questions = await FormQuestion.findAll({
               where: {
                    formId
               },
               include: [
                    {
                         model: QuestionBank,
                         attributes: defaultQuestionAttr,
                         include: [
                              {
                                   model: Answer,
                                   attributes: defaultAnswerAttr,
                              },
                         ]
                    },
               ]
          });
          questions = questions.map(q => {
               const QuestionBank = q?.dataValues?.QuestionBank?.dataValues
               return {
                    ...QuestionBank,
                    isEnable: q?.dataValues?.isEnable
               }
          }
          )
          return res.status(200).json({
               ok: true,
               data: questions
          })
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               ok: false,
               message: "Server error."
          })
     }
}

const createQuestion = async (req, res) => {
     const createData = req.body
     const { error, value } = createQuestionSchema.validate(createData);

     if (error) {
          return res.status(400).json({
               ok: false,
               message: `Validation error: ${error.details[0].message}`
          });
     }

     try {
          const questions = await QuestionBank.create(
               value,
               {
                    include: [
                         {
                              model: Answer,
                              as: 'Answers',
                         },
                    ],
               },
          )
          return res.status(200).json({
               ok: true,
               data: questions
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
     getAllQuestion,
     getQuestionsNotInForm,
     getQuestionsInForm,
     createQuestion,
}