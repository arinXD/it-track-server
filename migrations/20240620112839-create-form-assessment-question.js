'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('FormAssessmentQuestions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            isEnable: {
                type: Sequelize.BOOLEAN
            },
            formId: {
                allowNull: true,
                defaultValue: null,
                type: Sequelize.INTEGER,
                references: {
                    model: 'SuggestionForms',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            assessmentQuestionId: {
                allowNull: true,
                defaultValue: null,
                type: Sequelize.INTEGER,
                references: {
                    model: 'AssessmentQuestionBanks',
                    key: 'id',
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
        await queryInterface.dropTable('FormAssessmentQuestions');
    }
};