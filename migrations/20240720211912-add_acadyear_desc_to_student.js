'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn(
            'Students', // table name
            'acadyear_desc', // new field name
            {
                allowNull: true,
                defaultValue: null,
                type: Sequelize.STRING
            },)
    },

    async down(queryInterface, Sequelize) {
        queryInterface.removeColumn('Students', 'acadyear_desc')
    }
};
