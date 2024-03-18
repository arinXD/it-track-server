'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Selections', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            track_selection_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'TrackSelections',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            stu_id: {
                allowNull: false,
                unique: true,
                type: Sequelize.STRING,
                references: {
                    model: 'Students',
                    key: 'stu_id'
                },
                onDelete: 'CASCADE',
            },
            track_order_1: {
                allowNull: true,
                defaultValue: null,
                type: Sequelize.STRING,
                references: {
                    model: 'Tracks',
                    key: 'track'
                },
                onDelete: 'SET NULL',
            },
            track_order_2: {
                allowNull: true,
                defaultValue: null,
                type: Sequelize.STRING,
                references: {
                    model: 'Tracks',
                    key: 'track'
                },
                onDelete: 'SET NULL',
            },
            track_order_3: {
                allowNull: true,
                defaultValue: null,
                type: Sequelize.STRING,
                references: {
                    model: 'Tracks',
                    key: 'track'
                },
                onDelete: 'SET NULL',
            },
            result:{
                allowNull: true,
                defaultValue: null,
                unique: false,
                type: Sequelize.STRING,
                references: {
                    model: 'Tracks',
                    key: 'track'
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
        await queryInterface.dropTable('Selections');
    }
};