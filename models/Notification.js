'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Notification extends Model {
        static associate(models) {
            this.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user'
            });
        }
    }

    Notification.init({
        userId: DataTypes.INTEGER,
        text: DataTypes.STRING,
        destination: DataTypes.STRING,
        isRead: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'Notification',
    });
    return Notification;
};