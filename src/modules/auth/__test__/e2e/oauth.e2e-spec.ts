import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import AppModule from '../../../../app.module';
import createTestApp from '../../../../__test__/fixtures/create-e2e-nest-app.fixture';

describe('OAuth', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });
});
