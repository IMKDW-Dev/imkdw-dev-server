import { Test } from '@nestjs/testing';

import CategoryRepository from '../../../infra/category.repository';
import { ICategoryRepository } from '../../../repository/category-repo.interface';
import createClsModule from '../../../../../common/modules/cls.module';
import { createCategory } from '../../fixtures/create-category.fixture';
import { cleanupDatabase } from '../../../../../../prisma/__test__/utils/cleanup';
import PrismaService from '../../../../../infra/database/prisma.service';

describe('CategoryRepository', () => {
  let sut: ICategoryRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [createClsModule()],
      providers: [CategoryRepository],
    }).compile();

    sut = module.get<ICategoryRepository>(CategoryRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await cleanupDatabase(prisma);
  });

  describe('카테고리가 없을때', () => {
    it('다음 순서는 1이다', async () => {
      const nextSort = await sut.findNextSort();
      expect(nextSort).toBe(1);
    });
  });

  describe('이미 카테고리가 1개 존재한다면', () => {
    const category = createCategory();
    it('다음 sort는 2가 된다', async () => {
      await sut.save(category);

      const nextSort = await sut.findNextSort();
      expect(nextSort).toBe(2);
    });
  });
});
