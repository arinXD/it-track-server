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
                onDelete: 'CASCADE',
            },
            subject_code: {
                allowNull: true,
                defaultValue: null,
                type: Sequelize.STRING,
                references: {
                    model: 'Subjects',
                    key: 'subject_code'
                },
                onDelete: 'SET NULL',
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            daletedAt: {
                type: Sequelize.DATE,
                allowNull: true,
                validate: {}
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('TrackSubjects');
    }
};