'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn(
            'Selections', // table name
            'result', // new field name
            {
                allowNull: true,
                defaultValue: null,
                unique: false,
                type: Sequelize.STRING,
                references: {
                    model: 'Tracks',
                    key: 'track'
                },
            }, )
    },

    async down(queryInterface, Sequelize) {
        queryInterface.removeColumn('Selections', 'result')
    }
};