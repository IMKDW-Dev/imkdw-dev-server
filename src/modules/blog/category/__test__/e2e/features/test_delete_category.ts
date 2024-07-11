import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { registerNewUser } from '../../../../../auth/__test__/fixtures/auth.fixture';
import { userRoles } from '../../../../../user/domain/models/user-role.model';

export default async function testDeleteCategory(app: INestApplication, id: number): Promise<request.Response> {
  const { cookies } = await registerNewUser(app, userRoles.admin.name);

  return request(app.getHttpServer()).delete(`/v1/categories/${id}`).set('cookie', cookies).expect(HttpStatus.OK);
}
