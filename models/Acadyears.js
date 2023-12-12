'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Acadyears extends Model {

        static associate(models) {
            // define association here
        }
    }
    Acadyears.init({
        acadyear: {
            type: DataTypes.INTEGER,
            primaryKey: true, // Add this line to specify acadyear as the primary key
        },
        daletedAt: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Acadyears',
        paranoid: true,
        deletedAt: 'daletedAt',
    });
    return Acadyears;
};