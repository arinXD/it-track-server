'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SubjectDetail extends Model {
        static associate(models) {
            this.belongsTo(models.Subject, {
                foreignKey: 'subject_id',
                targetKey: 'subject_id',
                allowNull: true,
            });
        }
    }
    SubjectDetail.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        acadyear: DataTypes.INTEGER,
        semester: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'SubjectDetail',
    });
    return SubjectDetail;
};