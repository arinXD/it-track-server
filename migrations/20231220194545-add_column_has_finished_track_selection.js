'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn(
            'TrackSelections', // table name
            'has_finished', // new field name
            {
                allowNull: false,
                defaultValue: 0,
                type: Sequelize.BOOLEAN
            },)
    },

    async down(queryInterface, Sequelize) {
        queryInterface.removeColumn('TrackSelections', 'has_finished')
    }
};
