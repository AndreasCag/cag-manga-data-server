import UnexpectedFieldValueError from '@/errors/UnexpectedFieldValueError';
import {
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin,
  Model,
  Sequelize,
} from 'sequelize';
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
  public addGenre: HasManyAddAssociationMixin<Genre, number>;
  public getGenres: HasManyGetAssociationsMixin<Genre>;

  public toStructuredNestedJSON() {
    const { genres } = this;

    if (!genres) {
      throw new UnexpectedFieldValueError(
        'genres',
        'should be retrieved on instance initialisation',
        { genres },
      );
    }

    return {
      backgroundImage: this.backgroundImage,
      completeType: this.completeType,
      description: this.description,
      mainImage: this.mainImage,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      genres: genres
        .filter(genre => genre.MangaGenre!.genreType === 'genre')
        .map(genre => genre.toJSON()),
      subgenres: genres
        .filter(genre => genre.MangaGenre!.genreType === 'subgenre')
        .map(genre => genre.toJSON()),
    };
  }
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
    foreignKey: 'mangaId',
  });
};
