'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ConditionSubgroupVerify extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Verify, {
        foreignKey: 'verify_id',
      });
      this.belongsTo(models.SubGroup, {
        foreignKey: 'sub_group_id',
      });
    }
  }
  ConditionSubgroupVerify.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    credit: DataTypes.INTEGER,
    dec: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ConditionSubgroupVerify',
  });
  return ConditionSubgroupVerify;
};