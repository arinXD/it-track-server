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
        user_id: DataTypes.INTEGER,
        stu_id: DataTypes.STRING,
        email: DataTypes.STRING,
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        courses_type: DataTypes.STRING,
        stu_status: DataTypes.STRING,
        program: DataTypes.STRING,
        acadyear: DataTypes.INTEGER,
        track: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Student',
    });
    return Student;
};