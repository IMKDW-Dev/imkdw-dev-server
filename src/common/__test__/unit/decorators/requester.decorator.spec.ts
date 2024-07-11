import { Test, TestingModule } from '@nestjs/testing';
import { NextFunction, Request } from 'express';
import { Controller, Get, INestApplication, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import request from 'supertest';

import Requester from '../../../decorators/requester.decorator';
import { IRequester } from '../../../types/common.type';

let shouldSetUser = false;
class TestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (shouldSetUser) {
      req.user = { userId: 'userId', role: 'normal' };
    }
    next();
  }
}

@Controller('test')
class TestController {
  @Get()
  test(@Requester() requester: IRequester) {
    return { requester };
  }
}

@Module({
  controllers: [TestController],
})
class TestModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TestMiddleware).forRoutes('test');
  }
}

describe('Request Decorator', () => {
  let app: INestApplication;
  const API_PATH = '/test';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('요청자가 아예 없으면', () => {
    it('null을 반환한다', () => {
      shouldSetUser = false;
      return request(app.getHttpServer()).get(API_PATH).expect({ requester: null });
    });
  });

  describe('요청자가 주어지고', () => {
    const requester = { userId: 'userId', role: 'normal' };
    describe('요청자 데이터를 추출하면', () => {
      it('요청자를 반환한다', () => {
        shouldSetUser = true;
        return request(app.getHttpServer()).get(API_PATH).expect({ requester });
      });
    });
  });
});
