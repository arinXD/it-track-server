'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class FormAssessmentQuestion extends Model {
        static associate(models) {
            this.belongsTo(models.SuggestionForm, {
                foreignKey: 'formId',
                targetKey: 'id',
            });
            this.belongsTo(models.AssessmentQuestionBank, {
                foreignKey: 'assessmentQuestionId',
                targetKey: 'id',
            });
        }
    }
    FormAssessmentQuestion.init({
        isEnable: DataTypes.BOOLEAN,
        formId: DataTypes.INTEGER,
        assessmentQuestionId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'FormAssessmentQuestion',
    });
    return FormAssessmentQuestion;
};