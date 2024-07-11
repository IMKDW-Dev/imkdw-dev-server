import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { registerNewUser } from '../../../../../auth/__test__/fixtures/auth.fixture';
import { userRoles } from '../../../../../user/domain/models/user-role.model';
import Category from '../../../domain/models/category.model';

export default async function testUpdateCategoryImage(
  app: INestApplication,
  category: Category,
  data: { name: string; image: Express.Multer.File },
): Promise<request.Response> {
  const { cookies } = await registerNewUser(app, userRoles.admin.name);
  return request(app.getHttpServer())
    .patch(`/v1/categories/${category.getId()}`)
    .expect(HttpStatus.OK)
    .set('cookie', cookies)
    .attach('image', data.image.buffer, data.image.originalname)
    .field('name', data.name)
    .field('sort', category.getSort())
    .field('desc', category.getDesc())
    .expect(HttpStatus.OK);
}
