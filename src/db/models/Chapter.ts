import { DataTypes, Model, Sequelize } from 'sequelize';
import Manga from './Manga';
import Picture from './Picture';

class Chapter extends Model {
  public id!: number;
  public name!: string;
  public order!: number;
  public pictures!: Picture[];
  public mangaId!: number;
  public manga?: Manga;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default Chapter;

export const initChapter = (sequelize: Sequelize) => {
  Chapter.init({
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
    order: {
      type: new DataTypes.INTEGER(),
      allowNull: false,
    },
    mangaId: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: 'Mangas', // name of Target model
        key: 'id', // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  }, {
    sequelize,
    tableName: 'Chapters',
  });
};

export const initChapterAssociations = () => {
  Chapter.hasMany(Picture);
  Chapter.belongsTo(Manga, {
    foreignKey: 'mangaId',
    as: 'manga',
  });
};
