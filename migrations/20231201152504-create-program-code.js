'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ProgramCodes', {
            program_code: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: Sequelize.INTEGER
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
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('ProgramCodes');
    }
};