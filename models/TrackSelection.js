'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TrackSelection extends Model {

        static associate(models) {
            // define association here
        }
    }
    TrackSelection.init({
        acadyear: DataTypes.INTEGER,
        title: DataTypes.STRING,
        startAt: DataTypes.DATE,
        expiredAt: DataTypes.DATE,
        daletedAt: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'TrackSelection',
        paranoid: true,
        deletedAt: 'daletedAt',
    });
    return TrackSelection;
};