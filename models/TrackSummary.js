'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TrackSummary extends Model {
        static associate(models) {

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
        modelName: 'trackSummaries',
        tableName: 'TrackSummaries'
    });
    return TrackSummary;
};