import nock from 'nock';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import PrismaService from '../../../../../infra/database/prisma.service';
import { IStorageService } from '../../../../../infra/storage/interfaces/storage.interface';
import createTestApp from '../../../../../__test__/fixtures/create-e2e-app.fixture';
import { cleanupDatabase } from '../../../../../../prisma/__test__/utils/cleanup';
import testCreateCategory from './features/test_create_category';
import { generateMulterFile } from '../../../../../__test__/fixtures/create-multer-file.fixture';
import ContentType from '../../../../../infra/storage/enums/s3-content-type.enum';
import testGetCategories from './features/test_get_categories';
import { createCategory } from '../fixtures/create-category.fixture';
import testGetCategory from './features/test_get_category';
import testUpdateCategoryImage from './features/test_update_category_image';
import testUpdateCategorySort from './features/test_update_category_sort';
import testDeleteCategory from './features/test_delete_category';

describe('Category (e2e)', () => {
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

  afterEach(() => nock.cleanAll());

  describe('POST /v1/categories', () => {
    let response: request.Response;

    describe('카테고리를 생성하면', () => {
      const uploadedUrl = 'https://image.com/newProfile.png';
      const image = generateMulterFile();
      const imageExt = image.originalname.split('.').pop();

      it('생성된 카테고리 정보를 반환한다.', async () => {
        const uploadSpy = jest.spyOn(storageService, 'upload').mockResolvedValue(uploadedUrl);
        response = await testCreateCategory(app, image);
        expect(response.body.data.name).toBe('name');
        expect(response.body.data.desc).toBe('description');
        expect(response.body.data.image).toBe(uploadedUrl);
        expect(response.body.data.sort).toBe(1);
        expect(response.body.data.articleCount).toBe(0);
        expect(uploadSpy).toHaveBeenNthCalledWith(
          1,
          `categories/${response.body.data.id}/original.${imageExt}`,
          expect.anything(),
          ContentType.IMAGE,
        );

        expect(uploadSpy).toHaveBeenNthCalledWith(
          2,
          expect.stringMatching(new RegExp(`^categories/${response.body.data.id}/[^/]+\\.webp$`)),
          expect.anything(),
          ContentType.IMAGE,
        );
      });
    });
  });

  describe('GET /v1/categories', () => {
    let response: request.Response;

    describe('카테고리 목록을 조회하면', () => {
      const limit = 3;
      const categories = Array.from({ length: limit }, (_, i) => createCategory({ id: i + 1 }));

      it('카테고리 목록을 반환한다', async () => {
        await prisma.categories.createMany({
          data: categories.map((category) => ({
            name: category.getName(),
            desc: category.getDesc(),
            image: category.getImage(),
            sort: category.getSort(),
          })),
        });

        response = await testGetCategories(app, limit);
        expect(response.body.data.categories.length).toBe(limit);
        expect(response.body.data.categories[0].name).toBe(categories[0].getName());
        expect(response.body.data.categories[1].name).toBe(categories[1].getName());
        expect(response.body.data.categories[2].name).toBe(categories[2].getName());
      });
    });
  });

  describe('GET /v1/categories/:categoryId', () => {
    let response: request.Response;

    describe('카테고리 상세 정보를 조회하면', () => {
      const category = createCategory({ id: 1 });

      it('카테고리 상세 정보를 반환한다', async () => {
        await prisma.categories.create({
          data: {
            name: category.getName(),
            desc: category.getDesc(),
            image: category.getImage(),
            sort: category.getSort(),
          },
        });

        response = await testGetCategory(app, category.getName());
        expect(response.body.data.id).toBe(category.getId());
        expect(response.body.data.name).toBe(category.getName());
        expect(response.body.data.desc).toBe(category.getDesc());
        expect(response.body.data.image).toBe(category.getImage());
      });
    });
  });

  describe('PATCH /v1/categories/:categoryId', () => {
    describe('카테고리 이름과 이미지를 수정하면', () => {
      let response: request.Response;
      const category = createCategory({ id: 1 });
      const image = generateMulterFile();
      const imageExt = image.originalname.split('.').pop();
      const name = 'newName';
      const uploadedUrl = 'https://image.com/newProfile.png';

      it('수정된 카테고리 정보를 반환한다', async () => {
        await prisma.categories.create({
          data: {
            name: category.getName(),
            desc: category.getDesc(),
            image: category.getImage(),
            sort: category.getSort(),
          },
        });

        const uploadSpy = jest.spyOn(storageService, 'upload').mockResolvedValue(uploadedUrl);
        response = await testUpdateCategoryImage(app, category, {
          name,
          image,
        });

        expect(response.body.data.name).toBe(name);
        expect(response.body.data.desc).toBe(category.getDesc());
        expect(response.body.data.image).toBe(uploadedUrl);
        expect(response.body.data.sort).toBe(category.getSort());
        expect(uploadSpy).toHaveBeenNthCalledWith(
          1,
          `categories/${response.body.data.id}/original.${imageExt}`,
          expect.anything(),
          ContentType.IMAGE,
        );

        expect(uploadSpy).toHaveBeenNthCalledWith(
          2,
          expect.stringMatching(new RegExp(`^categories/${response.body.data.id}/[^/]+\\.webp$`)),
          expect.anything(),
          ContentType.IMAGE,
        );
      });
    });

    describe('카테고리 내용과 순서를 수정하면', () => {
      let response: request.Response;
      const categories = Array.from({ length: 3 }, (_, i) => createCategory({ id: i + 1, sort: i + 1 }));
      const sourceCategory = categories[0];
      const newDesc = 'newDescription';
      const newSort = 2;

      it('수정된 카테고리 정보를 반환한다', async () => {
        await prisma.categories.createMany({
          data: categories.map((category) => ({
            name: category.getName(),
            desc: category.getDesc(),
            image: category.getImage(),
            sort: category.getSort(),
          })),
        });

        response = await testUpdateCategorySort(app, sourceCategory, {
          desc: newDesc,
          sort: newSort,
        });

        expect(response.body.data.name).toBe(sourceCategory.getName());
        expect(response.body.data.desc).toBe(newDesc);
        expect(response.body.data.image).toBe(sourceCategory.getImage());
        expect(response.body.data.sort).toBe(newSort);
      });
    });
  });

  describe('DELETE /v1/categories/:categoryId', () => {
    describe('카테고리를 삭제하면', () => {
      const category = createCategory({ id: 1 });
      it('카테고리가 삭제된다', async () => {
        await prisma.categories.create({
          data: {
            name: category.getName(),
            desc: category.getDesc(),
            image: category.getImage(),
            sort: category.getSort(),
          },
        });

        await testDeleteCategory(app, category.getId());

        const deletedCategory = await prisma.categories.findFirst({ where: { id: category.getId() } });
        expect(deletedCategory).toBeNull();
      });
    });
  });
});
