'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AssessmentQuestionBank extends Model {
        static associate(models) {
            // define association here
        }
    }
    AssessmentQuestionBank.init({
        question: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'AssessmentQuestionBank',
    });
    return AssessmentQuestionBank;
};