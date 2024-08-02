'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            ALTER TABLE TrackSelections
            ADD COLUMN announcementDate DATETIME NULL DEFAULT NULL
            AFTER expiredAt
        `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('TrackSelections', 'announcementDate');
    }
};