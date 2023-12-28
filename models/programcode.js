'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProgramCode extends Model {
        
        static associate(models) {
            // Define association here
            // this.belongsTo(models.Program, {
            //     foreignKey: 'program',
            //     targetKey: 'program', // Specify the correct foreign key 
            // });
            // this.hasOne(models.Subject, {
            //     foreignKey: 'program_code'
            // });
        }
    }
    ProgramCode.init({
        program_code: {
            type: DataTypes.INTEGER,
            primaryKey: true, // Add this line to specify acadyear as the primary key
        },
        desc: DataTypes.STRING,
        version: DataTypes.INTEGER,
        program: DataTypes.STRING,
        desc: DataTypes.STRING,
        version: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'ProgramCode',
    });
    return ProgramCode;
};