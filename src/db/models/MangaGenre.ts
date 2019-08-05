import { DataTypes, Model, Sequelize } from 'sequelize';
import Chapter from './Chapter';

class MangaGenre extends Model {
  public id!: number;
  public genreType!: 'genre' | 'subgenre';
}

export default MangaGenre;

export const initMangaGenre = (sequelize: Sequelize) => {
  MangaGenre.init({
    genreId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Genres', // name of Target model
        key: 'id', // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    mangaId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      references: {
        model: 'Mangas', // name of Target model
        key: 'id', // key in Target model that we're referencing
      },
    },
    genreType: {
      type: DataTypes.ENUM('genre', 'subgenre'),
      defaultValue: 'genre',
    },
  }, {
    tableName: 'MangaGenres',
    sequelize,
  });
};
