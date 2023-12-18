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
        await queryInterface.bulkInsert('users', [
            {
                email: "rakuzanoat@gmail.com",
                role: "admin",
                sign_in_type: "google",
                verification: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ], {});
        await queryInterface.bulkInsert('studentdata', [
            // STUDENTCODE	STUDENTFULLNAME	KKUMAIL	PROGRAMNAME
            {
                student_code: "643020423-0",
                fullname: "อริญชวุธ กัลยานาม",
                email: "arinchawut.k@kkumail.com",
                program: "เทคโนโลยีสารสนเทศ",
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('acadyears', null, {});
        await queryInterface.bulkDelete('users', null, {});
        await queryInterface.bulkDelete('studentdata', null, {});
    }
};