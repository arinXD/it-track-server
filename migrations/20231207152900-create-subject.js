'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Subjects', {
            subject_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            subject_code: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            title_th: {
                type: Sequelize.STRING,
                defaultValue: null
            },
            title_en: {
                type: Sequelize.STRING,
                defaultValue: null
            },
            information: {
                type: Sequelize.STRING,
                defaultValue: null
            },
            credit: {
                type: Sequelize.INTEGER,
                defaultValue: null,
            },
            track: {
                allowNull: true,
                defaultValue: null,
                unique: false,
                type: Sequelize.STRING,
                references: {
                    model: 'Tracks',
                    key: 'track'
                },
                onDelete: 'SET NULL',
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deletedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Subjects');
    }
};