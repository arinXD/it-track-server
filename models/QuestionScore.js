'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class QuestionScore extends Model {
        static associate(models) {}
    }
    QuestionScore.init({
        suggestion_id: DataTypes.INTEGER,
        question: DataTypes.STRING,
        track: DataTypes.STRING,
        score: DataTypes.INTEGER,
        isCorrect: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'questionScores',
        tableName: 'QuestionScores',
    });
    return QuestionScore;
};