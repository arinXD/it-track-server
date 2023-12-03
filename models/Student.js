'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Student extends Model {
        static associate(models) {
            // define association (relation) here
        }
    }
    Student.init({
        stu_id: DataTypes.INTEGER,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        fname: DataTypes.STRING,
        lname: DataTypes.STRING,
        image: DataTypes.STRING,
        sign_in_type: DataTypes.STRING,
        verification: DataTypes.BOOLEAN,
    }, {
        sequelize,
        modelName: 'Student',
    });
    return Student;
};