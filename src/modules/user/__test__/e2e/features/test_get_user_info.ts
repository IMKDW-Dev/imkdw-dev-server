import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

// eslint-disable-next-line import/prefer-default-export
export const testGetUserInfo = async (
  app: INestApplication,
  userId: string,
  cookies: string,
): Promise<request.Response> => {
  return request(app.getHttpServer()).get(`/v1/users/${userId}`).set('cookie', cookies).expect(HttpStatus.OK);
};
