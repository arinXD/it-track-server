'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StudentItVerifyGrades', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      stu_id: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'Students',
          key: 'stu_id'
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
    await queryInterface.dropTable('StudentItVerifyGrades');
  }
};