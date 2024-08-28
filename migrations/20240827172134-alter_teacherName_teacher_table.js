'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        try {
            await queryInterface.removeColumn('Teachers', 'teacherName')
        } catch (error) {
            console.error(error);
        }
        await queryInterface.addColumn(
            'Teachers',
            'name',
            {
                allowNull: true,
                unique: false,
                type: Sequelize.STRING
            },)
        await queryInterface.addColumn(
            'Teachers',
            'surname',
            {
                allowNull: true,
                unique: false,
                type: Sequelize.STRING
            },)
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Teachers', 'name')
        await queryInterface.removeColumn('Teachers', 'surname')
    }
};
