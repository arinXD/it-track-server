'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here
      this.belongsTo(models.Categorie, {
        foreignKey: 'catagory_id',
        targetKey: 'id', // Specify the correct foreign key 
      });
      this.hasOne(models.SubGroup, {
        foreignKey: 'group_id'
      });
      this.hasOne(models.Subject, {
        foreignKey: 'group_id'
      });
    }
  }
  Group.init({
    group_title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};