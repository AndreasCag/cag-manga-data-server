const path = require('path');

module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  moduleFileExtensions: [
    'ts',
    'js',
  ],
  transform: {
    '.*\\.(ts)$': 'ts-jest',
  },
  setupFilesAfterEnv: [path.resolve(__dirname, 'tests/globalSetup.ts')],
}
