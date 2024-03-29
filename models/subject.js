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
            this.hasMany(models.SelectionDetail, {
                foreignKey: 'subject_code',
                sourceKey: 'subject_code',
            });
            this.belongsToMany(models.TrackSelection, {
                through: models.TrackSubject,
                foreignKey: "subject_code",
                otherKey: "track_selection_id"
            });

        }
    }
    Subject.init({
        subject_id: DataTypes.INTEGER,
        semester: DataTypes.STRING,
        subject_code: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        title_th: DataTypes.STRING,
        title_en: DataTypes.STRING,
        information: DataTypes.STRING,
        acadyear: DataTypes.INTEGER,
        credit: DataTypes.INTEGER,
        sub_group_id: DataTypes.INTEGER,
        group_id: DataTypes.INTEGER,
        // program_code: DataTypes.INTEGER
        // deletedAt: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'Subject',
        // paranoid: true,
        // deletedAt: 'deletedAt',
    });
    return Subject;
};