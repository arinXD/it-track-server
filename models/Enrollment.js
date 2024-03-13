'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Enrollment extends Model {
        static associate(models) {
            this.belongsTo(models.Student, {
                foreignKey: 'stu_id',
                targetKey: 'stu_id',
            });
            this.belongsTo(models.Subject, {
                foreignKey: 'subject_code',
                targetKey: 'subject_code',
            });
        }
    }
    Enrollment.init({
        stu_id: DataTypes.STRING,
        subject_code: DataTypes.STRING,
        grade: DataTypes.STRING,
        enroll_year: DataTypes.INTEGER,
        daletedAt: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'Enrollment',
        paranoid: true,
        deletedAt: 'daletedAt',
    });
    return Enrollment;
};