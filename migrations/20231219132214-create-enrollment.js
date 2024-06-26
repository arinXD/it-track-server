'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Enrollments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            stu_id: {
                allowNull: true,
                unique: false,
                type: Sequelize.STRING,
                references: {
                    model: 'Students',
                    key: 'stu_id'
                },
                defaultValue: null,
                onDelete:"CASCADE"
            },
            subject_id: {
                allowNull: true,
                unique: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Subjects',
                    key: 'subject_id'
                },
                defaultValue: null,
                onDelete:"SET NULL"
            },
            enroll_year: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            grade: {
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
        await queryInterface.dropTable('Enrollments');
    }
};