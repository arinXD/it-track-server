'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Teacher extends Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.User, {
                foreignKey: 'user_id', // Specify the correct foreign key
                targetKey: 'id', // Specify the target key in the Student model
            });
        }
    }
    Teacher.init({
        user_id: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Teacher',
    });
    return Teacher;
};