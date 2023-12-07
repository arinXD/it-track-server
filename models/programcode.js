'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProgramCode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here
      this.belongsTo(models.Program, {
        foreignKey: 'program_id',
        targetKey: 'id', // Specify the correct foreign key 
      });
      this.hasOne(models.Subject, {
        foreignKey: 'program_code_id'
      });
    }
  }
  ProgramCode.init({
    program_title: DataTypes.STRING,
    desc: DataTypes.STRING,
    version: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProgramCode',
  });
  return ProgramCode;
};