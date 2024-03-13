'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            email: {
                allowNull: false,
                unique: true,
                type: Sequelize.STRING
            },
            password: {
                type: Sequelize.STRING
            },
            image: {
                type: Sequelize.STRING
            },
            role: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "user",
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
        await queryInterface.dropTable('Users');
    }
};