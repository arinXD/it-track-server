'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Student extends Model {
        static associate(models) {
            this.hasMany(models.Enrollment, {
                foreignKey: 'stu_id',
                sourceKey: 'stu_id',
            });
            this.hasMany(models.StudentItVerifyGrade, {
                foreignKey: 'stu_id',
                sourceKey: 'stu_id',
            });
            this.hasOne(models.Selection, {
                foreignKey: "stu_id",
                sourceKey: 'stu_id',
            });
            this.belongsTo(models.User, {
                foreignKey: 'user_id',
                targetKey: 'id',
            });
            this.belongsTo(models.Program, {
                foreignKey: 'program',
                targetKey: 'program',
            });
            this.belongsTo(models.StudentStatus, {
                foreignKey: 'status_code',
                targetKey: 'id',
            });
            this.belongsTo(models.Teacher, {
                foreignKey: 'advisor', 
                targetKey: 'id',
                as: 'Advisor'
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
        program: DataTypes.STRING,
        acadyear: DataTypes.INTEGER,
        acadyear_desc: DataTypes.STRING,
        status_code: DataTypes.INTEGER,
        advisor: DataTypes.INTEGER,
        daletedAt: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'Student',
        paranoid: true,
        deletedAt: 'daletedAt',
    });
    return Student;
};