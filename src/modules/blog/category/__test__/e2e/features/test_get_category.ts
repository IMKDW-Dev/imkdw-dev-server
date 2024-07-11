import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

export default async function testGetCategory(app: INestApplication, name: string): Promise<request.Response> {
  return request(app.getHttpServer()).get(`/v1/categories/${name}`).expect(HttpStatus.OK);
}
