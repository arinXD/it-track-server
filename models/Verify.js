'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Verify extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.SubjectVerify, {
        foreignKey: 'verify_id',
      });
      this.belongsTo(models.Program, {
        foreignKey: 'program',
        targetKey: 'program'
      });
      this.belongsToMany(models.Subject, {
        through: models.SubjectVerify,
        foreignKey: "verify_id",
        otherKey: "subject_id"
      });
    }
  }
  Verify.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    verify: DataTypes.STRING,
    title: DataTypes.STRING,
    acadyear: DataTypes.INTEGER,
    program: DataTypes.STRING,
    main_at_least: DataTypes.INTEGER,
    deletedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Verify',
    paranoid: true,
    deletedAt: 'deletedAt',
  });
  return Verify;
};