'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.removeConstraint('Teachers', 'Teachers_ibfk_1');

        await queryInterface.changeColumn('Teachers', 'user_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null,
        });

        await queryInterface.addConstraint('Teachers', {
            fields: ['user_id'],
            type: 'foreign key',
            name: 'Teachers_ibfk_1',
            references: {
                table: 'Users',
                field: 'id',
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint('Teachers', 'Teachers_ibfk_1');

        await queryInterface.changeColumn('Teachers', 'user_id', {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true,
        });

        await queryInterface.addConstraint('Teachers', {
            fields: ['user_id'],
            type: 'foreign key',
            name: 'Teachers_ibfk_1',
            references: {
                table: 'Users',
                field: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    }
};