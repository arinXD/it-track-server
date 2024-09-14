'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StudentVerifyApprovements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      approver: {
        allowNull: true,
        defaultValue: null,
        unique: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      approver_time: {
        allowNull: true,
        type: Sequelize.DATE
      },
      desc: {
        allowNull: true,
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('StudentVerifyApprovements');
  }
};