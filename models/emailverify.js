'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class EmailVerify extends Model {
        static associate(models) {
            // Define association here
            this.belongsTo(models.Student, {
                foreignKey: 'student_id', // Specify the correct foreign key
                targetKey: 'id', // Specify the target key in the Student model
            });
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