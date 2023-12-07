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
        acadyear: DataTypes.INTEGER,
        daletedAt: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Acadyears',
    });
    return Acadyears;
};