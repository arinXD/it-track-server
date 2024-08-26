'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TrackPetition extends Model {

        static associate(models) {
            this.belongsTo(models.User, {
                foreignKey: 'senderId',
                targetKey: 'id',
                as: 'Sender'
            });
            this.belongsTo(models.User, {
                foreignKey: 'approver',
                targetKey: 'id',
                as: 'Approver'
            });
            this.belongsTo(models.Track, {
                foreignKey: 'oldTrack',
                targetKey: 'track',
            });
            this.belongsTo(models.Track, {
                foreignKey: 'newTrack',
                targetKey: 'track',
            });
        }
    }
    TrackPetition.init({
        title: DataTypes.STRING,
        detail: DataTypes.TEXT,
        status: DataTypes.INTEGER,
        senderId: DataTypes.INTEGER,
        approver: DataTypes.INTEGER,
        oldTrack: DataTypes.STRING,
        newTrack: DataTypes.STRING,
        responseText: DataTypes.TEXT,
        actionTime: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'TrackPetition',
        paranoid: true,
        deletedAt: 'deletedAt',
    });
    return TrackPetition;
};