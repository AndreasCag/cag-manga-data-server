const path = require('path');

module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    'tests/(.*)$': '<rootDir>/tests/$1',
  },
  moduleFileExtensions: [
    'ts',
    'js',
  ],
  transform: {
    '.*\\.(ts)$': 'ts-jest',
  },
  setupFilesAfterEnv: [path.resolve(__dirname, 'tests/globalSetup.ts')],
  globalSetup: path.resolve(__dirname, 'tests/setup.ts'),
}
