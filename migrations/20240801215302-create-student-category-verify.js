'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StudentCategoryVerifies', {
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
      category_verify_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'CategoryVerifies',
          key: 'id'
        },
        defaultValue: null
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
    await queryInterface.dropTable('StudentCategoryVerifies');
  }
};