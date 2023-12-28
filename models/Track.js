'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Track extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Track.init({
        track: {
            type: DataTypes.INTEGER,
            primaryKey: true, // Add this line to specify acadyear as the primary key
        },
        title_en: DataTypes.STRING,
        title_th: DataTypes.STRING,
        desc: DataTypes.STRING,
        information: DataTypes.TEXT,
        coverImg: DataTypes.STRING,
        img: DataTypes.STRING,
        daletedAt: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'Track',
        paranoid: true,
        deletedAt: 'daletedAt',
    });
    return Track;
};