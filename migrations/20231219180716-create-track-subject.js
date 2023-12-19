'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('TrackSubjects', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            track_selection_id: {
                allowNull: true,
                defaultValue: null,
                type: Sequelize.INTEGER,
                references: {
                    model: 'TrackSelections',
                    key: 'id',
                },
                onDelete: 'SET NULL',
            },
            subject_code: {
                allowNull: true,
                unique: false,
                type: Sequelize.STRING,
                references: {
                    model: 'Subjects',
                    key: 'subject_code'
                },
                defaultValue: null
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('TrackSubjects');
    }
};