'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class StudentData extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    StudentData.init({
        student_code: DataTypes.STRING,
        fullname: DataTypes.STRING,
        email: DataTypes.STRING,
        program: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'StudentData',
    });
    return StudentData;
};