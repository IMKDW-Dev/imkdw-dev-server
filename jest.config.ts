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
  coveragePathIgnorePatterns: [
    '.module.ts',
    'src/main.ts',
    '__test__',
    '.spec.ts',
    '.e2e-spec.ts',
    '.d.ts',
    '/constants/',
    '/enums/',
    '/docs/',
    'prisma.ts',
    'prisma.service.ts',
    'app.controller.ts',
    'app.service.ts',
    '.swagger.ts',
    '/dto/',
    '/interfaces/',
    '/types/',
    '/decorators/',
    '/guards/',
    '/middlewares/',
  ],
};

export default config;
