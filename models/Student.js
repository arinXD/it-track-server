'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Student extends Model {
        static associate(models) {
            // define association (relation) here
            this.belongsTo(models.User, {
                foreignKey: 'user_id', // Specify the correct foreign key
                targetKey: 'id', // Specify the target key in the Student model
            });
        }
    }
    Student.init({
        user_id: DataTypes.INTEGER,
        stu_id: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Student',
    });
    return Student;
};