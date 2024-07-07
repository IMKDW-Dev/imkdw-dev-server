import type { Config } from '@jest/types';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: '.env.test' });

const rootDir = resolve(__dirname, '..', '..');

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testMatch: [`${rootDir}/src/**/__test__/unit/**/*.spec.ts`],
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: resolve(rootDir, 'coverage'),
  testEnvironment: 'node',
  resetMocks: true,
  restoreMocks: true,
  clearMocks: true,
  maxWorkers: '90%',
  roots: [rootDir],
  verbose: true,
};

export default config;
