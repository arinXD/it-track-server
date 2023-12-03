'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('students', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            stu_id: {
                allowNull: true,
                unique: true,
                defaultValue: null,
                type: Sequelize.STRING
            },
            email: {
                allowNull: false,
                unique: true,
                type: Sequelize.STRING
            },
            password: {
                allowNull: true,
                defaultValue: null,
                type: Sequelize.STRING
            },
            fname: {
                type: Sequelize.STRING
            },
            lname: {
                type: Sequelize.STRING
            },
            image: {
                type: Sequelize.STRING
            },
            sign_in_type: {
                type: Sequelize.STRING
            },
            verification: {
                allowNull: false,
                defaultValue: 0,
                type: Sequelize.BOOLEAN
            },
            createdAt: {
                type: Sequelize.DATE,
            },
            updatedAt: {
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('students');
    }
};