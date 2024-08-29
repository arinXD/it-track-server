'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categorie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association (relation) here
      this.hasOne(models.Group, {
        foreignKey: 'category_id'
      });
      this.hasMany(models.Group, {
        foreignKey: 'category_id'
      });
      this.hasMany(models.ConditionCategoryVerify, {
        foreignKey: 'category_id'
      });
      this.belongsToMany(models.Verify, {
        through: models.CategoryVerify,
        foreignKey: "category_id",
        otherKey: "verify_id"
    });
    }
  }
  Categorie.init({
    category_title: DataTypes.STRING,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Categorie',
    paranoid: true,
    deletedAt: 'deletedAt',
  });
  return Categorie;
};