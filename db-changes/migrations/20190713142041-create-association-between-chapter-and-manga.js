
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Chapters', // name of Source model
      'mangaId', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Mangas', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Chapters', // name of Source model
      'mangaId' // key we want to remove
    );
  }
};
