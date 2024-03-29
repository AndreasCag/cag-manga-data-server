import { Sequelize } from 'sequelize/types';

export const seedData = [
  {
    name: 'Test1',
    description: 'description1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Test2',
    description: 'description2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Test3',
    description: 'description3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const up = async (sequelize: Sequelize) => {
  const queryInterface = sequelize.getQueryInterface();

  await queryInterface.bulkInsert('Genres', seedData);
};

export const down = async (sequelize: Sequelize) => {
  const queryInterface = sequelize.getQueryInterface();

  await queryInterface.bulkDelete('Genres', {}, {});
};
