'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SemiSubGroups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      semi_sub_group_title: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      sub_group_id: {
        allowNull: false,
        autoIncrement: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'SubGroups',
          key: 'id'
        },
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
    await queryInterface.dropTable('SemiSubGroups');
  }
};