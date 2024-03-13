'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class StudentStatus extends Model {
        static associate(models) {
            this.hasMany(models.Student, {
                foreignKey: 'status_code',
                sourceKey: 'id',
            });
        }
    }
    StudentStatus.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        description: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'StudentStatus',
        timestamps: false,
    });
    return StudentStatus;
};