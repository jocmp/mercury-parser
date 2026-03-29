/** @type {import('jest').Config} */
export default {
  transform: {
    '^.+\\.ts$': '@swc/jest',
  },
  moduleNameMapper: {
    '^mercury$': '<rootDir>/src/mercury.ts',
    '^resource$': '<rootDir>/src/resource',
    '^resource/(.*)$': '<rootDir>/src/resource/$1',
    '^utils$': '<rootDir>/src/utils',
    '^utils/(.*)$': '<rootDir>/src/utils/$1',
    '^cleaners$': '<rootDir>/src/cleaners',
    '^cleaners/(.*)$': '<rootDir>/src/cleaners/$1',
    '^extractors$': '<rootDir>/src/extractors',
    '^extractors/(.*)$': '<rootDir>/src/extractors/$1',
    '^test-helpers$': '<rootDir>/src/test-helpers.ts',
  },
  testMatch: [
    '<rootDir>/src/**/*.test.ts',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
};
