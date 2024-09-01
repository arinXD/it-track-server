'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            this.hasMany(models.SuggestionHistory, {
                foreignKey: 'user_id',
                as: 'suggestionHistories'
            });
            this.hasOne(models.Student, {
                foreignKey: "user_id"
            });
            this.hasOne(models.Teacher, {
                foreignKey: "user_id"
            });
            this.hasOne(models.EmailVerify, {
                foreignKey: "user_id"
            });
            this.hasMany(models.TrackPetition, {
                foreignKey: 'senderId', sourceKey: 'id',
            });
            this.hasMany(models.TrackPetition, {
                foreignKey: 'approver', sourceKey: 'id',
            });
            this.hasMany(models.Notification, {
                foreignKey: 'userId', sourceKey: 'id',
            });
        }
    }
    User.init({
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        image: DataTypes.STRING,
        role: DataTypes.STRING,
        sign_in_type: DataTypes.STRING,
        verification: DataTypes.BOOLEAN,
        daletedAt: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'User',
        paranoid: true,
        deletedAt: 'daletedAt',
    });
    return User;
};