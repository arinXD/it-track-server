'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Group extends Model {
        static associate(models) {
            // Define association here
            this.belongsTo(models.Categorie, {
                foreignKey: 'category_id',
                targetKey: 'id', // Specify the correct foreign key 
            });
            this.hasMany(models.SubGroup, {
                foreignKey: 'group_id',
                sourceKey: 'id',
            });

            // this.hasOne(models.SubGroup, {
            //     foreignKey: 'group_id'
            // });
            // this.hasOne(models.Subject, {
            //     foreignKey: 'group_id'
            // });
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