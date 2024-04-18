'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TeacherTrack extends Model {
        static associate(models) {
            this.belongsTo(models.Track, {
                foreignKey: 'track',
                targetKey: 'track',
            });
        }
    }
    TeacherTrack.init({
        teacherName: DataTypes.STRING,
        image: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'TeacherTrack',
    });
    return TeacherTrack;
};