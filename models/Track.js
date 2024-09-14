'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Track extends Model {

        static associate(models) {
            this.hasMany(models.Selection, {
                foreignKey: 'result', sourceKey: 'track',
            });
            this.hasMany(models.TeacherTrack, {
                foreignKey: 'track', sourceKey: 'track',
            });
            this.hasMany(models.Subject, {
                foreignKey: 'track', sourceKey: 'track',
            });
            this.hasMany(models.Career, {
                foreignKey: 'track', sourceKey: 'track',
            });
            this.hasMany(models.QuestionBank, {
                foreignKey: 'track', sourceKey: 'track',
            });
            this.hasMany(models.TrackPetition, {
                foreignKey: 'approver', sourceKey: 'track',
            });
            this.hasMany(models.TrackPetition, {
                foreignKey: 'oldTrack', sourceKey: 'track',
            });
            this.hasMany(models.QuestionScore, {
                foreignKey: 'track', sourceKey: 'track', as: 'questionScores'
            });
            this.hasMany(models.AssessmentScore, {
                foreignKey: 'track', sourceKey: 'track', as: 'assessmentScores'
            });
            this.hasMany(models.CareerScore, {
                foreignKey: 'track', sourceKey: 'track', as: 'careerScores'
            });
            this.hasMany(models.TrackSummary, {
                foreignKey: 'track', sourceKey: 'track', as: 'trackSummaries'
            });
            this.hasMany(models.Recommendation, {
                foreignKey: 'track', sourceKey: 'track', as: 'recommendations'
            });
        }
    }
    Track.init({
        track: {
            type: DataTypes.INTEGER,
            primaryKey: true, // Add this line to specify acadyear as the primary key
        },
        title_en: DataTypes.STRING,
        title_th: DataTypes.STRING,
        desc: DataTypes.STRING,
        information: DataTypes.TEXT,
        coverImg: DataTypes.STRING,
        img: DataTypes.STRING,
        daletedAt: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'Track',
        paranoid: true,
        deletedAt: 'daletedAt',
    });
    return Track;
};