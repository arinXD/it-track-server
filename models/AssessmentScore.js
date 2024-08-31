'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AssessmentScore extends Model {
        static associate(models) {
            
        }
    }
    AssessmentScore.init({
        suggestion_id: DataTypes.INTEGER,
        question: DataTypes.STRING,
        track: DataTypes.STRING,
        score: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'assessmentScores',
        tableName: 'AssessmentScores',
    });
    return AssessmentScore;
};