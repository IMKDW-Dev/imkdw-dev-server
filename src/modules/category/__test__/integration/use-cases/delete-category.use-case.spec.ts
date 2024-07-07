import { Test } from '@nestjs/testing';
import DeleteCategoryUseCase from '../../../use-cases/delete-category.use-case';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../../../repository/category-repo.interface';
import CategoryRepository from '../../../infra/category.repository';
import { cleanupDatabase } from '../../../../../../prisma/__test__/utils/cleanup';
import PrismaService from '../../../../../infra/database/prisma.service';
import { CategoryNotFoundException } from '../../../../../common/exceptions/404';
import { createCategory } from '../../fixtures/create-category.fixture';
import { CategoryHaveArticlesException } from '../../../../../common/exceptions/403';
import createConfigModule from '../../../../../common/modules/config.module';
import createClsModule from '../../../../../common/modules/cls.module';

describe('DeleteCategoryUseCase', () => {
  let sut: DeleteCategoryUseCase;
  let categoryRepository: ICategoryRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [createClsModule(), createConfigModule()],
      providers: [
        DeleteCategoryUseCase,
        {
          provide: CATEGORY_REPOSITORY,
          useClass: CategoryRepository,
        },
      ],
    }).compile();

    sut = module.get<DeleteCategoryUseCase>(DeleteCategoryUseCase);
    categoryRepository = module.get<ICategoryRepository>(CATEGORY_REPOSITORY);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await cleanupDatabase(prisma);
  });

  describe('삭제할려고 하는 카테고리가 없으면', () => {
    it('예외가 발생한다', async () => {
      await expect(sut.execute(99)).rejects.toThrow(CategoryNotFoundException);
    });
  });

  describe('카테고리에 게시글이 존재하는 경우', () => {
    const category = createCategory({ articleCount: 1 });
    it('예외가 발생한다', async () => {
      await categoryRepository.save(category);

      await expect(sut.execute(category.getId())).rejects.toThrow(CategoryHaveArticlesException);
    });
  });

  describe('카테고리에 게시글이 존재하지 않는 경우', () => {
    it('카테고리를 삭제된다', async () => {
      const category = createCategory();
      await categoryRepository.save(category);

      await sut.execute(category.getId());

      const deleteCategory = await categoryRepository.findOne({ id: category.getId() });
      expect(deleteCategory).toBeNull();
    });
  });
});
