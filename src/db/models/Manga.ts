import { DataTypes, HasManyGetAssociationsMixin, HasManySetAssociationsMixin, Model, Sequelize } from 'sequelize';
import Chapter from './Chapter';
import Genre from './Genre';
import MangaGenre from './MangaGenre';

export type CompleteType = 'ongoing' | 'completed';

class Manga extends Model {
  public id!: number;
  public name!: string;
  public completeType!: CompleteType;
  public description!: string;
  public mainImage!: string;
  public backgroundImage!: string;
  public chapters?: Chapter[];
  public genres?: Genre[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public setGenres: HasManySetAssociationsMixin<Genre, number>;
  public getGenres: HasManyGetAssociationsMixin<Genre>;
}

export default Manga;

export const initManga = (sequelize: Sequelize) => {
  Manga.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(),
      unique: true,
      allowNull: false,
    },
    completeType: {
      type: new DataTypes.ENUM('ongoing', 'completed'),
      allowNull: false,
    },
    description: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    mainImage: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    backgroundImage: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
  }, {
    tableName: 'Mangas',
    sequelize,
  });
};

export const initMangaAssociations = () => {
  Manga.hasMany(Chapter, {
    foreignKey: 'mangaId',
    as: 'chapters',
  });
  Manga.belongsToMany(Genre, {
    through: MangaGenre,
    as: 'genres',
    foreignKey: 'genreId',
  });
};
