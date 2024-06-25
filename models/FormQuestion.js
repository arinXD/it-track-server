'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class FormQuestion extends Model {
        static associate(models) {
            this.belongsTo(models.SuggestionForm, {
                foreignKey: 'formId',
                targetKey: 'id',
            });
            this.belongsTo(models.QuestionBank, {
                foreignKey: 'questionId',
                targetKey: 'id',
            });
        }
    }
    FormQuestion.init({
        isEnable: DataTypes.BOOLEAN,
        formId: DataTypes.INTEGER,
        questionId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'FormQuestion',
    });
    return FormQuestion;
};