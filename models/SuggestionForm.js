'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SuggestionForm extends Model {
        static associate(models) {
            this.hasMany(models.FormQuestion, {
                foreignKey: 'formId',
                sourceKey: 'id',
            });
        }
    }
    SuggestionForm.init({
        title: DataTypes.BOOLEAN,
        desc: DataTypes.BOOLEAN,
        isAvailable: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'SuggestionForm',
        paranoid: true,
        deletedAt: 'deletedAt',
    });
    return SuggestionForm;
};