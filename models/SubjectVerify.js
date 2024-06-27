'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubjectVerify extends Model {
    static associate(models) {
      this.belongsTo(models.Subject, {
        foreignKey: 'subject_id',
      });
      this.belongsTo(models.Verify, {
        foreignKey: 'verify_id',
      });
    }
  }
  SubjectVerify.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    subject_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    verify_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  }, {
    sequelize,
    modelName: 'SubjectVerify',
  });
  return SubjectVerify;
};