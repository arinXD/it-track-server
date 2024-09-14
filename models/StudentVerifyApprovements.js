'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentVerifyApprovements extends Model {
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
      this.belongsTo(models.User, {
        foreignKey: 'approver',
        targetKey: 'id',
      });
    }
  }
  StudentVerifyApprovements.init({
    approver_time: DataTypes.DATE,
    desc: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'StudentVerifyApprovements',
  });
  return StudentVerifyApprovements;
};