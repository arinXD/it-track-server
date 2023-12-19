'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TrackSelection extends Model {

        static associate(models) {
            this.belongsTo(models.Acadyears, {
                foreignKey: 'acadyear',
                targetKey: 'acadyear',
            });
            this.hasMany(models.Enrollment, {
                foreignKey: 'track_selection_id',
                sourceKey: 'id',
            });
            this.belongsToMany(models.Subject, {
                through: 'TrackSubjects',
                sourceKey: 'id',
                targetKey: 'track_id'
            });
        }
    }
    TrackSelection.init({
        acadyear: DataTypes.INTEGER,
        title: DataTypes.STRING,
        startAt: DataTypes.DATE,
        expiredAt: DataTypes.DATE,
        daletedAt: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'TrackSelection',
        paranoid: true,
        deletedAt: 'daletedAt',
    });
    return TrackSelection;
};