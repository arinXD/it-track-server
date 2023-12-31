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
                allowNull: true,
                defaultValue: null,
                type: Sequelize.INTEGER,
                references: {
                    model: 'TrackSelections',
                    key: 'id',
                },
                onDelete: 'SET NULL',
            },
            stu_id: {
                allowNull: true,
                unique: false,
                type: Sequelize.STRING,
                references: {
                    model: 'Students',
                    key: 'stu_id'
                },
                defaultValue: null
            },
            track_order_1: {
                allowNull: false,
                unique: false,
                type: Sequelize.STRING,
                references: {
                    model: 'Tracks',
                    key: 'track'
                },
            },
            track_order_2: {
                allowNull: false,
                unique: false,
                type: Sequelize.STRING,
                references: {
                    model: 'Tracks',
                    key: 'track'
                },
            },
            track_order_3: {
                allowNull: false,
                unique: false,
                type: Sequelize.STRING,
                references: {
                    model: 'Tracks',
                    key: 'track'
                },
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
        await queryInterface.dropTable('Selections');
    }
};