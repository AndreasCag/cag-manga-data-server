import { DataTypes, Model, Sequelize } from 'sequelize';

export const maxNameLength = 128;
export const maxDescriptionLength = 700;

class Genre extends Model {
  public id!: number;
  public name!: string;
  public description!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
  });
};
