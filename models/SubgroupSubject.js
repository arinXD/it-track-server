'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SubgroupSubject extends Model {

        static associate(models) {
            this.belongsTo(models.SubGroup, {
                foreignKey: 'sub_group_id',
                targetKey: 'id',
                allowNull: true,
            });
            this.belongsTo(models.Subject, {
                foreignKey: 'subject_id',
                targetKey: 'subject_id',
                allowNull: true,
            });
        }
    }
    SubgroupSubject.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        acadyear: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'SubgroupSubject',
    });
    return SubgroupSubject;
};