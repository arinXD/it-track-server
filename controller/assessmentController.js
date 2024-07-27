const models = require('../models');
const AssessmentQuestionBank = models.AssessmentQuestionBank
const FormAssessmentQuestion = models.FormAssessmentQuestion
const { Op } = require('sequelize');
const Joi = require('joi');
const defaultAssAttr = ["id", "question", "track", "desc"]

const createAssessmentSchema = Joi.object({
    question: Joi.string().required(),
    track: Joi.string().valid('BIT', 'Web and Mobile', 'Network').required(),
});

const getAllAssessments = async (req, res) => {
    try {
        const assessments = await AssessmentQuestionBank.findAll({
            attributes: defaultAssAttr,
        })
        return res.status(200).json({
            ok: true,
            data: assessments
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Server error"
        })
    }
}

const getAssessmentsNotInForm = async (req, res) => {
    const formId = req.params.id
    try {
        const formAssQuestions = await FormAssessmentQuestion.findAll({
            attributes: ['assessmentQuestionId'],
            where: { formId }
        });
        const assIdsInForm = formAssQuestions.map(fq => fq?.dataValues?.assessmentQuestionId);

        const assessments = await AssessmentQuestionBank.findAll({
            where: {
                id: {
                    [Op.notIn]: assIdsInForm
                }
            },
            attributes: defaultAssAttr,
        });
        return res.status(200).json({
            ok: true,
            data: assessments
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
}

const getAssessmentsInForm = async (req, res) => {
    const formId = req.params.id
    try {
        let assessments = await FormAssessmentQuestion.findAll({
            where: {
                formId
            },
            include: [
                {
                    model: AssessmentQuestionBank,
                    attributes: defaultAssAttr,
                },
            ]
        });
        assessments = assessments.map(q => {
            const assQuestionBank = q?.dataValues?.AssessmentQuestionBank?.dataValues
            return {
                ...assQuestionBank,
                isEnable: q?.dataValues?.isEnable
            }
        })
        return res.status(200).json({
            ok: true,
            data: assessments
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: "Server error."
        })
    }
}

const createAssessment = async (req, res) => {
    const createData = req.body
    const { error, value } = createAssessmentSchema.validate(createData);

    if (error) {
        return res.status(400).json({
            ok: false,
            message: `Validation error: ${error.details[0].message}`
        });
    }

    try {
        const assessment = await AssessmentQuestionBank.create(value)
        return res.status(200).json({
            ok: true,
            data: assessment
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
    getAllAssessments,
    createAssessment,
    getAssessmentsNotInForm,
    getAssessmentsInForm,
}