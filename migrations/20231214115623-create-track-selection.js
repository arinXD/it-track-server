'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('TrackSelections', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            acadyear: {
                allowNull: true,
                defaultValue: null,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Acadyears',
                    key: 'acadyear',
                },
                onDelete: 'SET NULL',
            },
            title: {
                type: Sequelize.STRING
            },
            startAt: {
                allowNull: true,
                defaultValue: null,
                type: Sequelize.DATE
            },
            expiredAt: {
                allowNull: true,
                defaultValue: null,
                type: Sequelize.DATE
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
                validate: {
                }
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('TrackSelections');
    }
};