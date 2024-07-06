import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { Type } from '@nestjs/common';

import AppModule from '../../app.module';
import { LOGGER } from '../../infra/logger/interfaces/logger.interface';
import { STORAGE_SERVICE } from '../../infra/storage/interfaces/storage.interface';

export default class IntegrationTestModule {
  private moduleRefBuilder: TestingModuleBuilder;
  private moduleRef: TestingModule;

  private constructor() {
    this.moduleRefBuilder = Test.createTestingModule({ imports: [AppModule] });
    this.mockingLogger();
    this.mockingStorageService();
  }

  private mockingLogger() {
    const mockLogger = { debug: jest.fn(), info: jest.fn(), error: jest.fn() };
    this.moduleRefBuilder.overrideProvider(LOGGER).useValue(mockLogger);
  }

  private mockingStorageService() {
    const storageService = {
      copyFile: jest.fn(),
      getUploadUrl: jest.fn(),
      upload: jest.fn(),
    };
    this.moduleRefBuilder.overrideProvider(STORAGE_SERVICE).useValue(storageService);
  }

  static async create(): Promise<IntegrationTestModule> {
    const instance = new IntegrationTestModule();
    instance.moduleRef = await instance.moduleRefBuilder.compile();
    return instance;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get<T = unknown>(key: Type<T> | string | symbol): T {
    return this.moduleRef.get<T>(key);
  }
}
