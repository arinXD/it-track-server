'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Recommendation extends Model {
        static associate(models) {

        }
    }
    Recommendation.init({
        suggestion_id: DataTypes.INTEGER,
        track: DataTypes.STRING,
        recText: DataTypes.STRING,
        descText: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'recommendation',
        tableName: 'Recommendations'
    });
    return Recommendation;
};