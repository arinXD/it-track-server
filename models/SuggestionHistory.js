'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SuggestionHistory extends Model {
        static associate(models) {
            
        }
    }
    SuggestionHistory.init({
        user_id: DataTypes.INTEGER,
        totalQuestionScore: DataTypes.INTEGER,
        overallScore: DataTypes.INTEGER,
        totalCorrectAnswers: DataTypes.INTEGER,
        totalQuestions: DataTypes.INTEGER,
        overallCorrectPercentage: DataTypes.FLOAT
    }, {
        sequelize,
        modelName: 'SuggestionHistory',
    });
    return SuggestionHistory;
};