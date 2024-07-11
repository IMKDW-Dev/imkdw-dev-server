import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { IStorageService } from '../../../../../infra/storage/interfaces/storage.interface';
import PrismaService from '../../../../../infra/database/prisma.service';
import createTestApp from '../../../../../__test__/fixtures/create-e2e-app.fixture';
import { cleanupDatabase } from '../../../../../../prisma/__test__/utils/cleanup';
import { createCategory } from '../../../category/__test__/fixtures/create-category.fixture';
import testCreateCategory from '../../../category/__test__/e2e/features/test_create_category';
import { generateMulterFile } from '../../../../../__test__/fixtures/create-multer-file.fixture';
import testCreateArticle from './features/test_create_article';
import { createRequestCreateArticleDto } from '../fixtures/article-dto.fixture';

describe('User (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let storageService: IStorageService;

  beforeAll(async () => {
    const testApps = await createTestApp();
    app = testApps.app;
    prisma = testApps.prisma;
    storageService = testApps.storageService;
    app.init();
  });

  beforeEach(async () => {
    await cleanupDatabase(prisma);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /v1/articles', () => {
    const uploadedUrl = 'https://image.com';
    const image = generateMulterFile();

    describe('게시글을 생성하면', () => {
      let response: request.Response;
      const category = createCategory();
      const dto = createRequestCreateArticleDto({ categoryId: category.getId(), tags: ['tag1'] });

      it('생성된 게시글을 반환한다', async () => {
        jest.spyOn(storageService, 'upload').mockResolvedValue(uploadedUrl);

        await testCreateCategory(app, image);
        response = await testCreateArticle(app, dto);

        expect(response.body.data.title).toBe(dto.title);
        expect(response.body.data.content.includes(dto.content)).toBeTruthy();
        expect(response.body.data.visible).toBe(dto.visible);
        expect(response.body.data.thumbnail).toBe(uploadedUrl);
        expect(response.body.data.tags).toEqual([
          {
            id: expect.any(Number),
            name: dto.tags[0],
          },
        ]);
      });
    });
  });

  describe('GET /v1/articles/:articleId', () => {});

  describe('GET /v1/articles', () => {});

  describe('PATCH /v1/:articleId/view', () => {});

  describe('DELETE /v1/articles/:articleId', () => {});

  describe('PATCH /v1/articles/:articleId', () => {});
});
