'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AssessmentScore extends Model {
        static associate(models) {
            this.belongsTo(models.SuggestionHistory, { foreignKey: 'suggestion_id', as: 'suggestionHistory' });
            this.belongsTo(models.Track, { foreignKey: 'track', targetKey: 'track', as: 'trackInfo' });
        }
    }
    AssessmentScore.init({
        suggestion_id: DataTypes.INTEGER,
        question: DataTypes.STRING,
        track: DataTypes.STRING,
        score: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'AssessmentScore',
        tableName: 'AssessmentScores',
    });
    return AssessmentScore;
};