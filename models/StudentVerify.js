'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class StudentVerify extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.Student, {
                foreignKey: 'stu_id',
                targetKey: 'stu_id',
            });
            this.belongsTo(models.Verify, {
                foreignKey: 'verify_id',
                targetKey: 'id',
            });
            this.hasMany(models.StudentVerifyDetail, {
                foreignKey: 'student_verify_id',
                sourceKey: 'id',
            });
        }
    }
    StudentVerify.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        term: DataTypes.STRING,
        cum_laude: DataTypes.INTEGER,
        acadyear: DataTypes.INTEGER,
        status: DataTypes.INTEGER,
        deletedAt: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'StudentVerify',
        paranoid: true,
        deletedAt: 'deletedAt',
    });
    return StudentVerify;
};