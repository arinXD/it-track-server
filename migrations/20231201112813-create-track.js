'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Tracks', {
            track: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING
            },
            title_en: {
                type: Sequelize.STRING
            },
            title_th: {
                type: Sequelize.STRING
            },
            desc: {
                type: Sequelize.STRING
            },
            information: {
                type: Sequelize.TEXT
            },
            coverImg: {
                type: Sequelize.STRING
            },
            img: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            daletedAt: {
                type: Sequelize.DATE,
                allowNull: true,
                validate: {}
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Tracks');
    }
};