'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TrackSubject extends Model {
    static associate(models) {
      // define association here
    }
  }
  TrackSubject.init({
    track_id: DataTypes.INTEGER,
    subject_code: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TrackSubject',
  });
  return TrackSubject;
};