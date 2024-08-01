'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn(
            'Teachers', // table name
            'email', // new field name
            {
                allowNull: false,
                unique: true,
                type: Sequelize.STRING
            },)
        await queryInterface.addColumn(
            'Teachers', // table name
            'teacherName', // new field name
            {
                allowNull: true,
                unique: false,
                type: Sequelize.STRING
            },)
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint('Teachers', 'email');
        await queryInterface.removeColumn('Teachers', 'name')
    }
};
