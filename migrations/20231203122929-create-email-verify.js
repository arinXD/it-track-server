'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('emailverifies', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            student_id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                references: {
                    model: 'students',
                    key: 'id'
                },
                allowNull: false
            },
            verify_string: {
                type: Sequelize.STRING
            },
            expired_at: {
                allowNull: false,
                type: Sequelize.DATE
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
        await queryInterface.dropTable('emailverifies');
    }
};