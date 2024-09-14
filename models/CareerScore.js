'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CareerScore extends Model {
        static associate(models) {
            this.belongsTo(models.SuggestionHistory, { foreignKey: 'suggestion_id', as: 'suggestionHistory' });
            this.belongsTo(models.Track, { foreignKey: 'track', targetKey: 'track', as: 'trackInfo' });
        }
    }
    CareerScore.init({
        suggestion_id: DataTypes.INTEGER,
        name_th: DataTypes.STRING,
        name_en: DataTypes.STRING,
        track: DataTypes.STRING,
        score: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'CareerScore',
        tableName: 'CareersScores'
    });
    return CareerScore;
};