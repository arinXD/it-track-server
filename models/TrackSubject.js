'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TrackSubject extends Model {
        static associate(models) {
            this.belongsTo(models.TrackSelection, {
                foreignKey: 'track_selection_id',
            });
            this.belongsTo(models.Subject, {
                foreignKey: 'subject_id',
            });
        }

    }
    TrackSubject.init({
        track_selection_id: DataTypes.INTEGER,
        subject_id: DataTypes.STRING,
        daletedAt: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'TrackSubject',
        paranoid: true,
        deletedAt: 'daletedAt',
    });
    return TrackSubject;
};