'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn(
            'Teachers',
            'email',
            {
                allowNull: false,
                unique: true,
                type: Sequelize.STRING
            },)
        await queryInterface.addColumn(
            'Teachers',
            'teacherName',
            {
                allowNull: true,
                unique: false,
                type: Sequelize.STRING
            },)
        await queryInterface.addColumn(
            'Teachers',
            'prefix',
            {
                allowNull: true,
                unique: false,
                type: Sequelize.STRING
            },)
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Teachers', 'email');
        await queryInterface.removeColumn('Teachers', 'teacherName')
        await queryInterface.removeColumn('Teachers', 'prefix')
    }
};
