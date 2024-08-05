'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SemiSubgroupSubject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.SemiSubGroup, {
        foreignKey: 'semi_sub_group_id',
        targetKey: 'id',
        allowNull: true,
      });
      this.belongsTo(models.Subject, {
        foreignKey: 'subject_id',
        targetKey: 'subject_id',
        allowNull: true,
      });
      this.belongsTo(models.Verify, {
        foreignKey: 'verify_id',
      });
      this.hasMany(models.StudentVerifyDetail, {
        foreignKey: 'semi_sub_group_subject_id',
      });
    }
  }
  SemiSubgroupSubject.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  }, {
    sequelize,
    modelName: 'SemiSubgroupSubject',
  });
  return SemiSubgroupSubject;
};