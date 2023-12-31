'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('studentdata', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            student_code: {
                unique: true,
                allowNull: false,
                type: Sequelize.STRING
            },
            fullname: {
                type: Sequelize.STRING
            },
            email: {
                unique: true,
                allowNull: false,
                type: Sequelize.STRING
            },
            program: {
                type: Sequelize.STRING
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
        await queryInterface.dropTable('studentdata');
    }
};