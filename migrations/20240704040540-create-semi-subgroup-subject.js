'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SemiSubgroupSubjects', {
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
      semi_sub_group_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'SemiSubGroups',
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
    await queryInterface.dropTable('SemiSubgroupSubjects');
  }
};