'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Admin extends Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.User, {
                foreignKey: 'user_id', 
                targetKey: 'id', 
            });
        }
    }
    Admin.init({
        user_id: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Admin',
    });
    return Admin;
};