'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Group, {
        foreignKey: 'group_id',
        targetKey: 'id', // Specify the correct foreign key 
      });
      this.hasOne(models.Subject, {
        foreignKey: 'sub_group_id'
      });
    }
  }
  SubGroup.init({
    sub_group_title: DataTypes.STRING
    
  }, {
    sequelize,
    modelName: 'SubGroup',
  });
  return SubGroup;
};