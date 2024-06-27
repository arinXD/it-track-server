const models = require('../models');
const AssessmentQuestionBank = models.AssessmentQuestionBank
const { Op } = require('sequelize');
const Joi = require('joi');

const createAssessmentSchema = Joi.object({
    question: Joi.string().required(),
    track: Joi.string().valid('BIT', 'Web and Mobile', 'Network').required(),
});

const getAllAssessments = async (req, res) => {
    try {
        const assessments = await AssessmentQuestionBank.findAll()
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
    createAssessment
}