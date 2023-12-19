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

        await queryInterface.bulkInsert('programs', [
            {
                program: "CS",
                title_en: "Computer Science",
                title_th: "วิทยาการคอมพิวเตอร์",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                program: "IT",
                title_en: "Information Technology",
                title_th: "เทคโนโลยีสารสนเทศ",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                program: "GIS",
                title_en: "Geo-Informatics",
                title_th: "ภูมิสารสนเทศศาสตร์",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                program: "AI",
                title_en: "Artificial Intelligence",
                title_th: "ปัญญาประดิษฐ์",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                program: "Cyber",
                title_en: "Cybersecurity",
                title_th: "ความมั่นคงปลอดภัยไซเบอร์",
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ], {});

        await queryInterface.bulkInsert('tracks', [
            {
                track: "BIS",
                title_en: "Business Information Technology",
                title_th: "เทคโนโลยีสารสนเทศทางธุรกิจ",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                track: "WEB",
                title_en: "Mobile and Web Application Development",
                title_th: "การพัฒนาโปรแกรมประยุกต์บนอุปกรณ์เคลื่อนที่และเว็บ",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                track: "Network",
                title_en: "Network Systems, Information Technology Security, and Internet of Things (IoT)",
                title_th: "ระบบ เครือข่าย ความมั่นคงเทคโนโลยีสารสนเทศ และอินเทอร์เน็ตของสรรพสิ่ง",
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('acadyears', null, {});
        await queryInterface.bulkDelete('users', null, {});
        await queryInterface.bulkDelete('programs', null, {});
        await queryInterface.bulkDelete('tracks', null, {});
        // await queryInterface.bulkDelete('studentdata', null, {});
    }
};