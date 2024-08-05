'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class News extends Model {
        static associate(models) {
            // define association here
        }
    }
    News.init({
        title: DataTypes.STRING,
        desc: DataTypes.TEXT,
        detail: DataTypes.TEXT,
        published: DataTypes.BOOLEAN,
        image: DataTypes.TEXT,
    }, {
        sequelize,
        modelName: 'News',
    });
    return News;
};