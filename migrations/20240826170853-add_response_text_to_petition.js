'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn(
            'TrackPetitions',
            'responseText',
            {
                allowNull: true,
                defaultValue: null,
                unique: false,
                type: Sequelize.TEXT,
            },)
        await queryInterface.addColumn(
            'TrackPetitions',
            'actionTime',
            {
                allowNull: true,
                defaultValue: null,
                unique: false,
                type: Sequelize.DATE
            },)
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('TrackPetitions', 'responseText');
        await queryInterface.removeColumn('TrackPetitions', 'actionTime');
    }
};
