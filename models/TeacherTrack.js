'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TeacherTrack extends Model {
        static associate(models) {
            this.belongsTo(models.Teacher, {
                foreignKey: 'teacher_id',
                targetKey: 'id',
            });
            this.belongsTo(models.Track, {
                foreignKey: 'track',
                targetKey: 'track',
            });
        }
    }
    TeacherTrack.init({
        teacher_id: DataTypes.INTEGER,
        image: DataTypes.STRING,
        track: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'TeacherTrack',
    });
    return TeacherTrack;
};