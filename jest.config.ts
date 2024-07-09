import type { Config } from '@jest/types';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  resetMocks: true,
  restoreMocks: true,
  clearMocks: true,
  coveragePathIgnorePatterns: ['/node_modules/', '/__test__/', '/docs/'],
};

export default config;
