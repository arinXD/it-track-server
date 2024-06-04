'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addConstraint('Careers', {
            fields: ['track'],
            type: 'foreign key',
            name: 'fk_career_track', // Optional: Name the constraint
            references: {
                table: 'Tracks',
                field: 'track'
            },
            onDelete: 'CASCADE', // Options: CASCADE, SET NULL, NO ACTION, etc.
            onUpdate: 'CASCADE'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeConstraint('Careers', 'fk_career_track');
    }
};
