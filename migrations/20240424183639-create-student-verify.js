'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StudentVerifies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      verify_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Verifies',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      stu_id: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
        references: {
          model: 'Students',
          key: 'stu_id'
        },
        onDelete: 'CASCADE',
      },
      term: {
        type: Sequelize.STRING
      },
      cum_laude: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      acadyear: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      status: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
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
    await queryInterface.dropTable('StudentVerifies');
  }
};