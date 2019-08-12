import { DataTypes, Model, Sequelize } from 'sequelize';
import Manga from './Manga';
import MangaGenre from './MangaGenre';

export const maxNameLength = 128;
export const maxDescriptionLength = 700;

class Genre extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public image!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // tslint:disable-next-line:variable-name
  public MangaGenre?: MangaGenre;

  public toStructuredJSON() {
    const { id, name, description, image, createdAt, updatedAt } = this;

    return {
      id,
      name,
      description,
      image,
      createdAt: Number(createdAt),
      updatedAt: Number(updatedAt),
    };
  }
}

export default Genre;

export const initGenre = (sequelize: Sequelize) => {
  Genre.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(maxNameLength),
      unique: true,
      allowNull: false,
    },
    description: {
      type: new DataTypes.STRING(maxDescriptionLength),
      allowNull: false,
    },
    image: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'Genres',
  });
};

export const initGenreAssociations = () => {
  Genre.belongsToMany(Manga, {
    through: MangaGenre,
    as: 'mangas',
    foreignKey: 'genreId',
  });
};
