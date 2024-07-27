'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ConditionSubgroupVerifies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      verify_id: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.INTEGER,
        references: {
          model: 'Verifies',
          key: 'id',
        },
        onDelete: 'CASCADE',
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
      credit: {
        type: Sequelize.INTEGER
      },
      dec: {
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
    await queryInterface.dropTable('ConditionSubgroupVerifies');
  }
};