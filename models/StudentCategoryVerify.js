'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentCategoryVerify extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.StudentVerify, {
        foreignKey: 'student_verify_id',
        targetKey: 'id',
      });
      this.belongsTo(models.CategoryVerify, {
        foreignKey: 'category_verify_id',
        targetKey: 'id',
      });
      this.belongsTo(models.Subject, {
        foreignKey: 'subject_id',
        targetKey: 'subject_id',
      });
      this.hasMany(models.StudentVerifyDetail, {
        foreignKey: 'category_subject_id',
        sourceKey: 'id',
    });
    }
  }
  StudentCategoryVerify.init({

  }, {
    sequelize,
    modelName: 'StudentCategoryVerify',
  });
  return StudentCategoryVerify;
};