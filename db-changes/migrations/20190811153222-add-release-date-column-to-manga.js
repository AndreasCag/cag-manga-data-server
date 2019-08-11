'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Mangas',
      'releaseDate',
      Sequelize.DATE,
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Mangas',
      'releaseDate'
    );
  }
};
