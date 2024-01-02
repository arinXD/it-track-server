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
            this.belongsToMany(models.Subject, {
                through: models.TrackSubject,
                foreignKey: "track_selection_id",
                otherKey: "subject_code"
            });
            this.hasMany(models.Selection, {
                foreignKey: 'track_selection_id',
                sourceKey: 'id',
            });
        }
    }
    TrackSelection.init({
        acadyear: DataTypes.INTEGER,
        title: DataTypes.STRING,
        startAt: DataTypes.DATE,
        expiredAt: DataTypes.DATE,
        has_finished: DataTypes.BOOLEAN,
        daletedAt: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'TrackSelection',
        paranoid: true,
        deletedAt: 'daletedAt',
    });
    return TrackSelection;
};