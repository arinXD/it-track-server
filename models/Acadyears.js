'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Acadyears extends Model {

        static associate(models) {
            this.hasMany(models.TrackSelection, {
                foreignKey: 'acadyear',
                sourceKey: 'acadyear',
            });
        }
    }
    Acadyears.init({
        acadyear: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
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