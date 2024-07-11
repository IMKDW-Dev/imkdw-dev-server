import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

// eslint-disable-next-line import/prefer-default-export
export const testUpdateUserNickname = async (
  app: INestApplication,
  userId: string,
  cookies: string,
  nickname: string,
): Promise<request.Response> => {
  return request(app.getHttpServer())
    .patch(`/v1/users/${userId}`)
    .set('cookie', cookies)
    .send({ nickname })
    .expect(HttpStatus.OK);
};
