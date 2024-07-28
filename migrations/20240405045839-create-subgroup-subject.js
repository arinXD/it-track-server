'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('SubgroupSubjects', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            verify_id: {
                allowNull: true,
                type: Sequelize.INTEGER,
                references: {
                  model: 'Verifies',
                  key: 'id',
                },
                onDelete: 'CASCADE',
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
            sub_group_id: {
                allowNull: true,
                type: Sequelize.INTEGER,
                references: {
                    model: 'SubGroups',
                    key: 'id'
                },
                defaultValue: null
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
        await queryInterface.dropTable('SubgroupSubjects');
    }
};