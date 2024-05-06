'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Verifies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        type: Sequelize.INTEGER
      },
      verify: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      acadyear: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      program: {
        allowNull: false,
        autoIncrement: false,
        type: Sequelize.STRING,
        references: {
          model: 'Programs',
          key: 'program'
        },
        allowNull: false
      },
      main_at_least: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Verifies');
  }
};