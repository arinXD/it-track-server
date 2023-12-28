'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('SubGroups', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            sub_group_title: {
                type: Sequelize.STRING
            },
            group_id: {
                allowNull: false,
                autoIncrement: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Groups',
                    key: 'id'
                },
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('SubGroups');
    }
};