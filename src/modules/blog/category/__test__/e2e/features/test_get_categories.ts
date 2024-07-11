import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

export default async function testGetCategories(app: INestApplication, limit: number): Promise<request.Response> {
  return request(app.getHttpServer()).get(`/v1/categories?limit=${limit}`).expect(HttpStatus.OK);
}
