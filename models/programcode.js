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
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
        },
        program_code: DataTypes.STRING,
        desc: DataTypes.STRING,
        version: DataTypes.INTEGER,
        program: DataTypes.STRING,
        deletedAt: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'ProgramCode',
        paranoid: true,
        deletedAt: 'deletedAt',
    });
    return ProgramCode;
};