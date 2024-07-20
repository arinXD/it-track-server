'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AssessmentQuestionBank extends Model {
        static associate(models) {
            this.hasMany(models.FormAssessmentQuestion, {
                foreignKey: 'assessmentQuestionId',
                sourceKey: 'id',
            });
            this.belongsTo(models.Track, {
                foreignKey: 'track',
                targetKey: 'track',
            });
        }
    }
    AssessmentQuestionBank.init({
        question: DataTypes.TEXT,
        track: DataTypes.STRING,
        desc: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'AssessmentQuestionBank',
    });
    return AssessmentQuestionBank;
};