'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SubGroup extends Model {
        static associate(models) {
            this.belongsTo(models.Group, {
                foreignKey: 'group_id'
            });
            this.hasMany(models.SubgroupSubject, {
                foreignKey: 'sub_group_id',
                sourceKey: 'id',
            });
        }
    }
    SubGroup.init({
        sub_group_title: DataTypes.STRING,
        deletedAt: DataTypes.DATE,

    }, {
        sequelize,
        modelName: 'SubGroup',
        paranoid: true,
        deletedAt: 'deletedAt',
    });
    return SubGroup;
};