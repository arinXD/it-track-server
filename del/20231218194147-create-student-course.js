'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('StudentCourses', {
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
                    model: 'students',
                    key: 'stu_id'
                },
                defaultValue: null
            },
            subject_code: {
                allowNull: true,
                unique: false,
                type: Sequelize.STRING,
                references: {
                    model: 'Subjects',
                    key: 'subject_code'
                },
                defaultValue: null
            },
            grade: {
                type: Sequelize.INTEGER
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
        await queryInterface.dropTable('StudentCourses');
    }
};