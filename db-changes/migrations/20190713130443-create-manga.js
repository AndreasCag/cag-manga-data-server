'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Mangas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      completeType: {
        allowNull: false,
        type: Sequelize.ENUM('ongoing', 'completed')
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mainImage: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      backgroundImage: {
        type: Sequelize.STRING,
        allowNull: false,
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Mangas');
  }
};
