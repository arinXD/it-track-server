'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class QuestionBank extends Model {
        static associate(models) {
            this.hasMany(models.FormQuestion, {
                foreignKey: 'questionId',
                sourceKey: 'id',
            });
            this.hasMany(models.Answer, {
                foreignKey: 'questionId',
                sourceKey: 'id',
            });
            this.belongsTo(models.Track, {
                foreignKey: 'track',
                targetKey: 'track',
            });
        }
    }
    QuestionBank.init({
        question: DataTypes.TEXT,
        isMultipleChoice: DataTypes.BOOLEAN,
        track: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'QuestionBank',
    });
    return QuestionBank;
};