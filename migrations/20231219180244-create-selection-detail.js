'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('selectiondetails', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            selection_id: {
                allowNull: true,
                defaultValue: null,
                type: Sequelize.INTEGER,
                references: {
                    model: 'selections',
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
            grade: {
                type: Sequelize.INTEGER
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
        await queryInterface.dropTable('SelectionDetails');
    }
};