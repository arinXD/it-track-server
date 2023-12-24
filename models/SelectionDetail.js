'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SelectionDetail extends Model {
        static associate(models) {
            this.belongsTo(models.Selection, {
                foreignKey: 'selection_id',
                targetKey: 'id',
            });
            this.belongsTo(models.Subject, {
                foreignKey: 'subject_code',
                targetKey: 'subject_code',
            });
        }
    }
    SelectionDetail.init({
        selection_id: DataTypes.INTEGER,
        subject_code: DataTypes.STRING,
        grade: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'SelectionDetail',
    });
    return SelectionDetail;
};