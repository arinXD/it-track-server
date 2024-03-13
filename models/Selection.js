'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Selection extends Model {
        static associate(models) {
            this.belongsTo(models.TrackSelection, {
                foreignKey: 'track_selection_id',
                targetKey: 'id',
            });
            this.belongsTo(models.Student, {
                foreignKey: 'stu_id',
                targetKey: 'stu_id',
            });
            this.hasMany(models.SelectionDetail, {
                foreignKey: 'selection_id',
                sourceKey: 'id',
            });
        }
    }
    Selection.init({
        track_selection_id: DataTypes.INTEGER,
        stu_id: DataTypes.STRING,
        track_order_1: DataTypes.STRING,
        track_order_2: DataTypes.STRING,
        track_order_3: DataTypes.STRING,
        result: DataTypes.STRING,
        daletedAt: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'Selection',
        paranoid: true,
        deletedAt: 'daletedAt',
    });
    return Selection;
};