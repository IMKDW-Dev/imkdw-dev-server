import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { registerNewUser } from '../../../../../auth/__test__/fixtures/auth.fixture';
import { userRoles } from '../../../../../user/domain/models/user-role.model';

export default async function testCreateCategory(
  app: INestApplication,
  image: Express.Multer.File,
): Promise<request.Response> {
  const { cookies } = await registerNewUser(app, userRoles.admin.name);

  return request(app.getHttpServer())
    .post(`/v1/categories`)
    .set('cookie', cookies)
    .attach('image', image.buffer, image.originalname)
    .field('name', 'name')
    .field('desc', 'description')
    .expect(HttpStatus.CREATED);
}
