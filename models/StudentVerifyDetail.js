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
            this.belongsTo(models.GroupSubject, {
                foreignKey: 'group_subject_id',
                targetKey: 'id',
            });
            this.belongsTo(models.SubgroupSubject, {
                foreignKey: 'sub_group_subject_id',
                targetKey: 'id',
            });
            this.belongsTo(models.SemiSubgroupSubject, {
                foreignKey: 'semi_sub_group_subject_id',
                targetKey: 'id',
            });
            this.belongsTo(models.StudentCategoryVerify, {
                foreignKey: 'category_subject_id',
                sourceKey: 'id',
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