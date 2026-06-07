'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'resetToken', {
      type:         Sequelize.STRING,
      allowNull:    true,
      defaultValue: null,
    });

    await queryInterface.addColumn('Users', 'resetTokenExpiry', {
      type:         Sequelize.DATE,
      allowNull:    true,
      defaultValue: null,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'resetToken');
    await queryInterface.removeColumn('Users', 'resetTokenExpiry');
  },
};