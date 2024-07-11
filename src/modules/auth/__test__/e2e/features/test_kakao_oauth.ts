import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

// eslint-disable-next-line import/prefer-default-export
export const testKakaoOAuth = async (app: INestApplication): Promise<request.Response> => {
  return request(app.getHttpServer())
    .post('/v1/oauth/kakao')
    .set('Authorization', 'Bearer accessToken')
    .send({ code: 'code', redirectUri: 'redirectUri' })
    .expect(HttpStatus.CREATED);
};
