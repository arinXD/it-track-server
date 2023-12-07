'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('acadyears', [
            {
                acadyear: 2562,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                acadyear: 2563,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                acadyear: 2564,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                acadyear: 2565,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                acadyear: 2566,
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('acadyears', null, {});
    }
};