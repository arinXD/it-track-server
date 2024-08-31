'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SuggestionHistory extends Model {
        static associate(models) {
            this.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });
            this.hasMany(models.QuestionScore, {
                foreignKey: 'suggestion_id',
                sourceKey: 'id',
                as: 'questionScores'
            });
            this.hasMany(models.AssessmentScore, { foreignKey: 'suggestion_id', sourceKey: 'id', as: 'assessmentScores' });
            this.hasMany(models.CareerScore, { foreignKey: 'suggestion_id', sourceKey: 'id', as: 'careerScores' });
            this.hasMany(models.TrackSummary, { foreignKey: 'suggestion_id', sourceKey: 'id', as: 'trackSummaries' });
            this.hasMany(models.Recommendation, { foreignKey: 'suggestion_id', sourceKey: 'id', as: 'recommendations' });
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