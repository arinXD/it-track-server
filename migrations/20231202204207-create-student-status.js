'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('StudentStatuses', {
            id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            description: {
                type: Sequelize.STRING
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('StudentStatuses');
    }
};