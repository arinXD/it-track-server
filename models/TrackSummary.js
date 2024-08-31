'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TrackSummary extends Model {
        static associate(models) {
            this.belongsTo(models.SuggestionHistory, { foreignKey: 'suggestion_id', as: 'suggestionHistory' });
            this.belongsTo(models.Track, { foreignKey: 'track', targetKey: 'track', as: 'trackInfo' });
        }
    }
    TrackSummary.init({
        suggestion_id: DataTypes.INTEGER,
        track: DataTypes.STRING,
        questionScore: DataTypes.INTEGER,
        assessmentScore: DataTypes.INTEGER,
        careerScore: DataTypes.INTEGER,
        totalScore: DataTypes.INTEGER,
        correctAnswers: DataTypes.INTEGER,
        totalQuestions: DataTypes.INTEGER,
        correctPercentage: DataTypes.FLOAT,
        summary: DataTypes.STRING,

    }, {
        sequelize,
        modelName: 'TrackSummary',
        tableName: 'TrackSummaries'
    });
    return TrackSummary;
};