'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Program extends Model {

        static associate(models) {
            // define association (relation) here
            this.hasOne(models.ProgramCode, {
                foreignKey: 'program'
            });
        }
    }
    Program.init({
        program: {
            type: DataTypes.STRING,
            primaryKey: true, // Add this line to specify acadyear as the primary key
        },
        title_en: DataTypes.STRING,
        title_th: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Program',
    });
    return Program;
};