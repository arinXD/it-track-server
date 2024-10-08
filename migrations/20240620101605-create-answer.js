'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Answers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            answer: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            isCorrect: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            questionId: {
                allowNull: false,
                unique: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'QuestionBanks',
                    key: 'id'
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
        await queryInterface.dropTable('Answers');
    }
};