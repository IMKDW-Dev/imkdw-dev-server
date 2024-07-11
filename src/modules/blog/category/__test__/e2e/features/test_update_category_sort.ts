import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { registerNewUser } from '../../../../../auth/__test__/fixtures/auth.fixture';
import { userRoles } from '../../../../../user/domain/models/user-role.model';
import Category from '../../../domain/models/category.model';

export default async function testUpdateCategorySort(
  app: INestApplication,
  category: Category,
  data: { desc: string; sort: number },
): Promise<request.Response> {
  const { cookies } = await registerNewUser(app, userRoles.admin.name);
  return request(app.getHttpServer())
    .patch(`/v1/categories/${category.getId()}`)
    .expect(HttpStatus.OK)
    .set('cookie', cookies)
    .field('name', category.getName())
    .field('sort', data.sort)
    .field('desc', data.desc)
    .expect(HttpStatus.OK);
}
