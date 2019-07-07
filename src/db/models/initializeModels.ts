import { Sequelize } from 'sequelize';
import { initGenre } from './Genre';

export default (sequelize: Sequelize) => {
  initGenre(sequelize);
};
