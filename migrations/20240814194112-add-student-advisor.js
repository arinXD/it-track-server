'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn(
            'Students', // table name
            'advisor', // new field name
            {
                allowNull: true,
                defaultValue: null,
                unique: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Teachers',
                    key: 'id',
                },
                onDelete: 'SET NULL',
            },)
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint('Students', 'advisor');
    }
};
