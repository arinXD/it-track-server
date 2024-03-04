'use strict';
const {
    Model
} = require('sequelize');
const {
    getThaiDateTime
} = require('../lib/date');
module.exports = (sequelize, DataTypes) => {
    Date.prototype.toJSON = function () {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        const rwaDate = this.toLocaleString('th-TH', options)
        let [date, time] = rwaDate?.split(" ")
        let [day, month, year] = date?.split("/")
        const formatedDate = `${parseInt(year)-543}-${month}-${day}T${time}.000Z`
        return formatedDate
    };
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
    }, {
        sequelize,
        modelName: 'Selection',
    });
    return Selection;
};