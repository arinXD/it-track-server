'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class StudentCourse extends Model {
        static associate(models) {
            this.belongsTo(models.Student, {
                foreignKey: 'stu_id',
                targetKey: 'stu_id',
            });
            this.belongsTo(models.Subject, {
                foreignKey: 'subject_code',
                targetKey: 'subject_code',
            });
        }
    }
    StudentCourse.init({
        stu_id: DataTypes.INTEGER,
        subject_code: DataTypes.STRING,
        grade: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'StudentCourse',
    });
    return StudentCourse;
};