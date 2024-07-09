'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SemiSubGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.SubGroup, {
        foreignKey: 'sub_group_id'
      });
      this.hasMany(models.SemiSubgroupSubject, {
        foreignKey: 'semi_sub_group_id',
        sourceKey: 'id',
    });
    }
  }
  SemiSubGroup.init({
    semi_sub_group_title: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'SemiSubGroup',
  });
  return SemiSubGroup;
};