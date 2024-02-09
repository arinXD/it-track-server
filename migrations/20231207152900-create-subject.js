'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Subjects', {
            subject_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            semester: {
                type: Sequelize.STRING,
                defaultValue: null
            },
            subject_code: {
                type: Sequelize.STRING,
                unique: true,
                primaryKey: true,
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
            credit: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
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
            acadyear: {
                allowNull: true,
                defaultValue: null,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Acadyears',
                    key: 'acadyear'
                },
            },
            // program_code_id: {
            //     allowNull: true,
            //     type: Sequelize.INTEGER,
            //     references: {
            //         model: 'ProgramCodes',
            //         key: 'id'
            //     },
            //     defaultValue: null
            // },
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