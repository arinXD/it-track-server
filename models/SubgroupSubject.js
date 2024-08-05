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
            this.belongsTo(models.Verify, {
                foreignKey: 'verify_id',
            });
            this.hasMany(models.StudentVerifyDetail, {
                foreignKey: 'sub_group_subject_id',
              });
        }
    }
    SubgroupSubject.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
    }, {
        sequelize,
        modelName: 'SubgroupSubject',
    });
    return SubgroupSubject;
};