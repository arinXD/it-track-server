'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Students', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                allowNull: true,
                defaultValue: null,
                unique: true,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onDelete: 'SET NULL',
            },
            stu_id: {
                allowNull: true,
                unique: true,
                defaultValue: null,
                type: Sequelize.STRING
            },
            email: {
                allowNull: true,
                unique: true,
                defaultValue: null,
                type: Sequelize.STRING
            },
            first_name: {
                allowNull: true,
                defaultValue: null,
                type: Sequelize.STRING,
            },
            last_name: {
                allowNull: true,
                defaultValue: null,
                type: Sequelize.STRING,
            },
            courses_type: {
                allowNull: true,
                defaultValue: null,
                type: Sequelize.STRING,
            },
            program: {
                allowNull: true,
                defaultValue: null,
                type: Sequelize.STRING,
                references: {
                    model: 'Programs',
                    key: 'program',
                },
                onDelete: 'SET NULL',
            },
            acadyear: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            status_code: {
                allowNull: false,
                defaultValue: 10,
                unique: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'StudentStatuses',
                    key: 'id',
                },
                onDelete: 'RESTRICT',
            },
            createdAt: {
                type: Sequelize.DATE,
            },
            updatedAt: {
                type: Sequelize.DATE,
            },
            daletedAt: {
                type: Sequelize.DATE,
                allowNull: true,
                validate: {}
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Students');
    }
};