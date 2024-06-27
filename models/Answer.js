'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Answer extends Model {
        static associate(models) {
            this.belongsTo(models.QuestionBank, {
                foreignKey: 'questionId',
                targetKey: 'id',
            });
        }
    }
    Answer.init({
        answer: DataTypes.TEXT,
        isCorrect: DataTypes.BOOLEAN,
    }, {
        sequelize,
        modelName: 'Answer',
    });
    return Answer;
};