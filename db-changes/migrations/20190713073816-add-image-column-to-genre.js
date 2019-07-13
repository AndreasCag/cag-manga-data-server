'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Genres',
      'image',
      Sequelize.STRING,
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Genres',
      'image'
    );
  }
};
