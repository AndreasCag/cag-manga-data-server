import { Sequelize } from 'sequelize';
import { POSTGRES_URI } from './config';
import initializeModels from './models/initializeModels';

export const sequelize = new Sequelize(POSTGRES_URI);

let isDbInitialised = false;

export const initialiseDb = async () => {
  if (isDbInitialised) {
    return;
  }

  isDbInitialised = true;

  await sequelize.authenticate();
  initializeModels(sequelize);
};
