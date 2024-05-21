'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Career extends Model {
        static associate(models) {
            this.belongsTo(models.Track, {
                foreignKey: 'track',
                targetKey: 'track',
            });
        }
    }
    Career.init({
        name_th: DataTypes.STRING,
        name_en: DataTypes.STRING,
        image: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Career',
    });
    return Career;
};