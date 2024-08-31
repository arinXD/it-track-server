'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Teacher extends Model {
        static associate(models) {
            this.belongsTo(models.User, {
                foreignKey: 'user_id', // Specify the correct foreign key
                targetKey: 'id', // Specify the target key in the Student model
            });
            this.hasMany(models.Student, {
                foreignKey: 'advisor',
                sourceKey: 'id',
            });
        }
    }
    Teacher.init({
        user_id: DataTypes.INTEGER,
        email: DataTypes.STRING,
        prefix: DataTypes.STRING,
        name: DataTypes.STRING,
        surname: DataTypes.STRING,
        daletedAt: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'Teacher',
        paranoid: true,
        deletedAt: 'daletedAt',
    });
    return Teacher;
};