'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Subject extends Model {
        static associate(models) {
            this.belongsTo(models.Group, {
                foreignKey: 'group_id',
                targetKey: 'id',
                allowNull: true,
            });
            this.belongsTo(models.SubGroup, {
                foreignKey: 'sub_group_id',
                targetKey: 'id',
                allowNull: true,
            });
            this.hasMany(models.Enrollment, {
                foreignKey: 'subject_code',
                sourceKey: 'subject_code',
            });
            this.belongsToMany(models.TrackSelection, {
                through: 'TrackSubjects',
                sourceKey: 'subject_code',
                targetKey: 'subject_code'
            });
        }
    }
    Subject.init({
        subject_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        semester: DataTypes.STRING,
        subject_code: DataTypes.STRING,
        title_th: DataTypes.STRING,
        title_en: DataTypes.STRING,
        information: DataTypes.STRING,
        credit: DataTypes.INTEGER,
        sub_group_id: DataTypes.INTEGER,
        group_id: DataTypes.INTEGER,
        acadyear: DataTypes.INTEGER,
        // program_code: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Subject',
    });
    return Subject;
};