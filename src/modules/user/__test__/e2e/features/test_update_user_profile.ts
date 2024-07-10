import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

// eslint-disable-next-line import/prefer-default-export
export const testUpdateUserProfile = async (
  app: INestApplication,
  userId: string,
  cookies: string,
  image: Express.Multer.File,
): Promise<request.Response> => {
  return request(app.getHttpServer())
    .patch(`/v1/users/${userId}`)
    .set('cookie', cookies)
    .set('Content-Type', 'multipart/form-data')
    .attach('profileImage', image.buffer, image.originalname)
    .field('nickname', 'nickname')
    .expect(HttpStatus.OK);
};
