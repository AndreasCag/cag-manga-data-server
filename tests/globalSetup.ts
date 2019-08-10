import { initialiseDb, sequelize } from '@/db';

beforeAll(async () => {
  await initialiseDb();
});

afterAll(async () => {
  await sequelize.close();
});
