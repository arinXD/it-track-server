'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('QuestionScores', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            suggestion_id: {
                allowNull: false,
                unique: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'SuggestionHistories',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            question: {
                type: Sequelize.STRING
            },
            track: {
                allowNull: true,
                defaultValue: null,
                type: Sequelize.STRING,
                references: {
                    model: 'Tracks',
                    key: 'track'
                },
                onDelete: 'SET NULL',
            },
            score: {
                type: Sequelize.INTEGER
            },
            isCorrect: {
                type: Sequelize.BOOLEAN
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
        await queryInterface.dropTable('QuestionScores');
    }
};