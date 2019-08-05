import { DataTypes, Model, Sequelize } from 'sequelize';
import Chapter from './Chapter';

class Picture extends Model {
  public id!: number;
  public path!: string;
  public description: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default Picture;

export const initPicture = (sequelize: Sequelize) => {
  Picture.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    path: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    description: {
      type: new DataTypes.STRING(),
      allowNull: true,
    },
    chapterId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'Chapters', // name of Target model
        key: 'id', // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  }, {
    tableName: 'Pictures',
    sequelize,
  });
};

export const initPictureAssociations = () => {
  Picture.belongsTo(Chapter);
};
