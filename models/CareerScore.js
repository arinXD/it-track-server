'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CareerScore extends Model {
        static associate(models) {

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
        modelName: 'careersScores',
        tableName: 'CareersScores'
    });
    return CareerScore;
};