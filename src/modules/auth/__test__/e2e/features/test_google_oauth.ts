import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { mockGoogleOAuthGetUserInfoApi } from '../../helpers/google-oauth.helper';

// eslint-disable-next-line import/prefer-default-export
export const testGoogleOAuth = async (app: INestApplication): Promise<request.Response> => {
  mockGoogleOAuthGetUserInfoApi('imkdw@imkdw.dev');
  return request(app.getHttpServer())
    .post('/v1/oauth/google')
    .set('Authorization', 'Bearer accessToken')
    .expect(HttpStatus.CREATED);
};
