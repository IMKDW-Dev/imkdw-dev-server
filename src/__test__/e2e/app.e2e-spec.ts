import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import AppModule from '../../app.module';
import { LOGGER } from '../../infra/logger/interfaces/logger.interface';

describe('App', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(LOGGER)
      .useValue({
        info: () => {},
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('GET /', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect({
      data: 'Hello World!',
    });
  });
});
