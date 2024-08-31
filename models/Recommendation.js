'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Recommendation extends Model {
        static associate(models) {
            this.belongsTo(models.SuggestionHistory, { foreignKey: 'suggestion_id', as: 'suggestionHistory' });
            this.belongsTo(models.Track, { foreignKey: 'track', targetKey: 'track', as: 'trackInfo' });
        }
    }
    Recommendation.init({
        suggestion_id: DataTypes.INTEGER,
        track: DataTypes.STRING,
        recText: DataTypes.STRING,
        descText: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Recommendation',
        tableName: 'Recommendations'
    });
    return Recommendation;
};