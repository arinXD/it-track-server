'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class FormCareer extends Model {
        static associate(models) {
            this.belongsTo(models.SuggestionForm, {
                foreignKey: 'formId',
                targetKey: 'id',
            });
            this.belongsTo(models.Career, {
                foreignKey: 'careerId',
                targetKey: 'id',
            });
        }
    }
    FormCareer.init({
        formId: DataTypes.INTEGER,
        careerId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'FormCareer',
    });
    return FormCareer;
};