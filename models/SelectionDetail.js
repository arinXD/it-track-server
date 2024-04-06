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
                foreignKey: 'subject_id',
                targetKey: 'subject_id',
            });
        }
    }
    SelectionDetail.init({
        selection_id: DataTypes.INTEGER,
        subject_id: DataTypes.STRING,
        grade: DataTypes.STRING,
        daletedAt: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'SelectionDetail',
        paranoid: true,
        deletedAt: 'daletedAt',
    });
    return SelectionDetail;
};