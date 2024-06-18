'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class StudentVerifyDetail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.Subject, {
                foreignKey: 'subject_id',
                targetKey: 'subject_id',
            });
            this.belongsTo(models.StudentVerify, {
                foreignKey: 'student_verify_id',
                targetKey: 'id',
            });
        }
    }
    StudentVerifyDetail.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        grade: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'StudentVerifyDetail',
    });
    return StudentVerifyDetail;
};