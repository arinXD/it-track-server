'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Program extends Model {

        static associate(models) {
            this.hasOne(models.Verify, {
                foreignKey: 'program'
            });
            this.hasMany(models.Student, {
                foreignKey: 'program',
                sourceKey: 'program',
            });
        }
    }
    Program.init({
        program: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        title_en: DataTypes.STRING,
        title_th: DataTypes.STRING,
        deletedAt: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Program',
        paranoid: true,
        deletedAt: 'deletedAt',
    });
    return Program;
};