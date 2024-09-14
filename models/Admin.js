'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Admin extends Model {
        static associate(models) {
            this.belongsTo(models.User, {
                foreignKey: 'user_id',
                targetKey: 'id',
            });
        }
    }
    Admin.init({
        user_id: DataTypes.INTEGER,
        name: DataTypes.STRING,
        surname: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Admin',
    });
    return Admin;
};