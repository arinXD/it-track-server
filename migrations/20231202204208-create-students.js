'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('students', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            stu_id: {
                allowNull: true,
                unique: true,
                defaultValue: null,
                type: Sequelize.STRING
            },
            email:{
                allowNull: true,
                unique: true,
                defaultValue: null,
                type: Sequelize.STRING
            },
            user_id: {
                allowNull: true,
                defaultValue: null,
                unique: true,
                type: Sequelize.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'SET NULL',
            },
            program: {
                allowNull: true,
                defaultValue: null,
                type: Sequelize.STRING,
                references: {
                    model: 'programs',
                    key: 'program',
                },
                onDelete: 'SET NULL',
            },
            courses_type: {
                allowNull: true,
                defaultValue: null,
                type: Sequelize.STRING,
            },
            acadyear: {
                allowNull: true,
                defaultValue: null,
                type: Sequelize.INTEGER,
                references: {
                    model: 'acadyears',
                    key: 'acadyear',
                },
                onDelete: 'SET NULL',
            },
            track: {
                allowNull: true,
                defaultValue: null,
                type: Sequelize.STRING,
                references: {
                    model: 'tracks',
                    key: 'track',
                },
                onDelete: 'SET NULL',
            },
            createdAt: {
                type: Sequelize.DATE,
            },
            updatedAt: {
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('students');
    }
};