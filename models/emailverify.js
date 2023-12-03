'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class EmailVerify extends Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.Student);
        }
    }
    EmailVerify.init({
        student_id: DataTypes.INTEGER,
        verify_string: DataTypes.STRING,
        expired_at: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'EmailVerify',
    });
    return EmailVerify;
};