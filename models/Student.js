'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Student extends Model {
        static associate(models) {
            this.belongsTo(models.User, {
                foreignKey: 'user_id',
                targetKey: 'id',
            });
            this.hasMany(models.Enrollment, {
                foreignKey: 'stu_id',
                sourceKey: 'stu_id',
                // as: 'StudentCourses',
            });
            this.hasOne(models.Selection, {
                foreignKey: "stu_id"
            });

        }
    }
    Student.init({
        stu_id: DataTypes.STRING,
        email: DataTypes.STRING,
        user_id: DataTypes.INTEGER,
        program: DataTypes.STRING,
        courses_type: DataTypes.STRING,
        acadyear: DataTypes.INTEGER,
        track: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Student',
    });
    return Student;
};