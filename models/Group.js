'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Group extends Model {
        static associate(models) {
            // Define association here
            this.belongsTo(models.Categorie, {
                foreignKey: 'category_id'
            });
            this.hasMany(models.SubGroup, {
                foreignKey: 'group_id'
            });
            this.hasMany(models.GroupSubject, {
                foreignKey: 'group_id',
            });
        }
    }
    Group.init({
        group_title: DataTypes.STRING,
        deletedAt: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'Group',
        paranoid: true,
        deletedAt: 'deletedAt',
    });
    return Group;
};