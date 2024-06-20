'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('AssessmentQuestionBanks', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            question: {
                type: Sequelize.TEXT
            },
            track: {
                allowNull: true,
                defaultValue: null,
                unique: false,
                type: Sequelize.STRING,
                references: {
                    model: 'Tracks',
                    key: 'track'
                },
                onDelete: 'CASCADE',
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
        await queryInterface.dropTable('AssessmentQuestionBanks');
    }
};