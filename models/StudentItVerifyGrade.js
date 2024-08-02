'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentItVerifyGrade extends Model {
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
      this.belongsTo(models.Student, {
        foreignKey: 'stu_id',
        targetKey: 'stu_id',
    });
    }
  }
  StudentItVerifyGrade.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    grade: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'StudentItVerifyGrade',
  });
  return StudentItVerifyGrade;
};