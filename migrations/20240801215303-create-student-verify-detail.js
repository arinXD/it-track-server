'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('StudentVerifyDetails', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            subject_id: {
                allowNull: true,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Subjects',
                    key: 'subject_id'
                },
                defaultValue: null
            },
            student_verify_id: {
                allowNull: true,
                type: Sequelize.INTEGER,
                references: {
                    model: 'StudentVerifies',
                    key: 'id'
                },
                defaultValue: null
            },
            group_subject_id: {
                allowNull: true,
                type: Sequelize.INTEGER,
                references: {
                    model: 'GroupSubjects',
                    key: 'id'
                },
                defaultValue: null
            },
            sub_group_subject_id: {
                allowNull: true,
                type: Sequelize.INTEGER,
                references: {
                    model: 'SubgroupSubjects',
                    key: 'id'
                },
                defaultValue: null
            },
            semi_sub_group_subject_id: {
                allowNull: true,
                type: Sequelize.INTEGER,
                references: {
                    model: 'SemiSubgroupSubjects',
                    key: 'id'
                },
                defaultValue: null
            },
            category_subject_id: {
                allowNull: true,
                type: Sequelize.INTEGER,
                references: {
                    model: 'StudentCategoryVerifies',
                    key: 'id'
                },
                defaultValue: null
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
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('StudentVerifyDetails');
    }
};