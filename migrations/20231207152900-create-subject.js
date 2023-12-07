'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Subjects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      semester: {
        type: Sequelize.STRING,
        defaultValue: 1
      },
      subject_code: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      title_th: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      title_en: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      information: {
        type: Sequelize.STRING,
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
      group_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Groups',
          key: 'id'
        },
        defaultValue: null
      },
      program_code_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'ProgramCodes',
          key: 'id'
        },
        defaultValue: null
      },
      cradit: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
    await queryInterface.dropTable('Subjects');
  }
};