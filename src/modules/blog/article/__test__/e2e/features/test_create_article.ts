import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { registerNewUser } from '../../../../../auth/__test__/fixtures/auth.fixture';
import { userRoles } from '../../../../../user/domain/models/user-role.model';
import RequestCreateArticleDto from '../../../dto/request/create-article.dto';

export default async function testCreateArticle(
  app: INestApplication,
  dto: RequestCreateArticleDto,
): Promise<request.Response> {
  const { cookies } = await registerNewUser(app, userRoles.admin.name);

  return request(app.getHttpServer())
    .post('/v1/articles')
    .set('cookie', cookies)
    .attach('thumbnail', dto.thumbnail.buffer, dto.thumbnail.originalname)
    .field('id', dto.id)
    .field('title', dto.title)
    .field('content', dto.content)
    .field('visible', dto.visible)
    .field('categoryId', dto.categoryId)
    .field('tags[0]', dto.tags[0])
    .field('images', dto.images)
    .expect(201);
}
