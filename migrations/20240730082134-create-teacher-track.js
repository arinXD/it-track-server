'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('TeacherTracks', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            teacher_id: {
                allowNull: false,
                unique: true,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Teachers',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            image: {
                type: Sequelize.STRING
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
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('TeacherTracks');
    }
};