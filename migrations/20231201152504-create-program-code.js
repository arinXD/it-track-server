'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ProgramCodes', {
            id:{
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
                type: Sequelize.INTEGER
            },
            program_code: {
                allowNull: false,
                unique: true,
                type: Sequelize.STRING
            },
            desc: {
                type: Sequelize.STRING
            },
            version: {
                type: Sequelize.INTEGER
            },
            program: {
                allowNull: false,
                autoIncrement: false,
                type: Sequelize.STRING,
                references: {
                    model: 'Programs',
                    key: 'program'
                },
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deletedAt:{
                allowNull: true,
                defaultValue: null,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('ProgramCodes');
    }
};