'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn(
            'AssessmentQuestionBanks', // table name
            'desc', // new field name
            {
                allowNull: true,
                defaultValue: null,
                type: Sequelize.STRING
            },)
    },

    async down(queryInterface, Sequelize) {
        queryInterface.removeColumn('AssessmentQuestionBanks', 'desc')
    }
};