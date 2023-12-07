'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.ProgramCode, {
        foreignKey: 'program_code_id',
        targetKey: 'id', // Specify the correct foreign key 
        allowNull: true
      });
      this.belongsTo(models.Group, {
        foreignKey: 'group_id',
        targetKey: 'id', // Specify the correct foreign key 
        allowNull: true
        
      });
      this.belongsTo(models.SubGroup, {
        foreignKey: 'sub_group_id',
        targetKey: 'id', // Specify the correct foreign key 
        allowNull: true
      });
    }
  }
  Subject.init({
    semester: DataTypes.STRING,
    subject_code: DataTypes.STRING,
    title_th: DataTypes.STRING,
    title_en: DataTypes.STRING,
    information: DataTypes.STRING,
    cradit: DataTypes.INTEGER,
    sub_group_id: DataTypes.INTEGER,
    group_id: DataTypes.INTEGER,
    program_code_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Subject',
  });
  return Subject;
};