import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import AppModule from '../../../../app.module';

describe('Article', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  describe('POST /v1/articles', () => {
    it.todo('게시글 작성 테스트');
  });
});
