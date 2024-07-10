'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Subject extends Model {
        static associate(models) {
            // this.belongsTo(models.Group, {
            //     foreignKey: 'group_id',
            //     targetKey: 'id',
            //     allowNull: true,
            // });

            this.hasMany(models.GroupSubject, {
                foreignKey: 'subject_id',
                sourceKey: 'subject_id',
            });
            this.hasMany(models.SubgroupSubject, {
                foreignKey: 'subject_id',
                sourceKey: 'subject_id',
            });
            this.hasMany(models.SemiSubgroupSubject, {
                foreignKey: 'subject_id',
                sourceKey: 'subject_id',
            });
            this.hasMany(models.SubjectDetail, {
                foreignKey: 'subject_id',
                sourceKey: 'subject_id',
            });

            this.hasMany(models.Enrollment, {
                foreignKey: 'subject_id',
                sourceKey: 'subject_id',
            });
            this.hasMany(models.SelectionDetail, {
                foreignKey: 'subject_id',
                sourceKey: 'subject_id',
            });
            this.belongsToMany(models.TrackSelection, {
                through: models.TrackSubject,
                foreignKey: "subject_id",
                otherKey: "track_selection_id"
            });
            this.belongsTo(models.Track, {
                foreignKey: 'track',
                targetKey: 'track',
                allowNull: true,
            });
            this.belongsToMany(models.Verify, {
                through: models.SubjectVerify,
                foreignKey: "subject_id",
                otherKey: "verify_id"
            });
            this.belongsToMany(models.Group, {
                through: models.GroupSubject,
                foreignKey: "subject_id",
                otherKey: "group_id"
            });
            this.belongsToMany(models.SubGroup, {
                through: models.SubgroupSubject,
                foreignKey: "subject_id",
                otherKey: "sub_group_id"
            });

            this.hasMany(models.StudentVerifyDetail, {
                foreignKey: 'subject_id',
                sourceKey: 'subject_id',
            });
        }
    }
    Subject.init({
        subject_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        subject_code: DataTypes.STRING,
        title_th: DataTypes.STRING,
        title_en: DataTypes.STRING,
        information: DataTypes.STRING,
        credit: DataTypes.INTEGER,
        track: DataTypes.STRING,
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