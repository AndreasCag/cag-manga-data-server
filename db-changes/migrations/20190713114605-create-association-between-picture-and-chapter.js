
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Pictures', // name of Source model
      'chapterId', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Chapters', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Pictures', // name of Source model
      'chapterId' // key we want to remove
    );
  }
};
