import { initialiseDb, sequelize } from '@/db';
import { execSync } from 'child_process';
import fg from 'fast-glob';

// @NOTE cannot find a convenient way to setup and shutdown db before tests.
// In globalSetup hook moduleNameMapper doesn't work

let isDbInitialized = false;
let amountOfPassedTestFiles = 0;

const amountOfTestFiles = fg.sync('**/*.test.ts').length;

beforeAll(async () => {
  if (isDbInitialized) {
    return;
  }

  isDbInitialized = true;

  execSync('npm run setup-test-db');

  await initialiseDb();
});

afterAll(async () => {
  amountOfPassedTestFiles++;

  if (amountOfPassedTestFiles !== amountOfTestFiles) {
    return;
  }

  await sequelize.close();
});
