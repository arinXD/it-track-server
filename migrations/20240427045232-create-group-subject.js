'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GroupSubjects', {
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
      group_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
            model: 'Groups',
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
    await queryInterface.dropTable('GroupSubjects');
  }
};