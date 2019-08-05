module.exports = {
  up: (queryInterface, Sequelize) => {
    // Product belongsToMany Tag
    return queryInterface.createTable(
      'MangaGenres',
      {
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        genreId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references: {
            model: 'Genres', // name of Target model
            key: 'id', // key in Target model that we're referencing
          },
          onDelete: 'CASCADE',
        },
        genreType: {
          type: Sequelize.ENUM('genre', 'subgenre'),
          defaultValue: 'genre',
        },
        mangaId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references: {
            model: 'Mangas', // name of Target model
            key: 'id', // key in Target model that we're referencing
          },
          onDelete: 'CASCADE',
        },
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    // remove table
    return queryInterface.dropTable('MangaGenres');
  },
};
