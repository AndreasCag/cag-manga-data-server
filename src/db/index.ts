import { Sequelize } from 'sequelize';
import { POSTGRES_URI } from './config';
import initializeModels from './models/initializeModels';

export const sequelize = new Sequelize(POSTGRES_URI);

export const initialiseDb = async () => {
  await sequelize.authenticate();

  initializeModels(sequelize);
};

export const initialize = () => {
  initializeModels(sequelize);
};

export const fakeInitialize = () => {
  const sequelize = new Sequelize({
    dialect: 'postgres',
  });

  initializeModels(sequelize);
};
