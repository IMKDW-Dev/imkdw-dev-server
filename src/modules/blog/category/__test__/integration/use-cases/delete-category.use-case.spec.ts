import { Test } from '@nestjs/testing';
import DeleteCategoryUseCase from '../../../use-cases/delete-category.use-case';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../../../repository/category-repo.interface';
import CategoryRepository from '../../../infra/category.repository';
import { createCategory } from '../../fixtures/create-category.fixture';
import PrismaService from '../../../../../../infra/database/prisma.service';
import createClsModule from '../../../../../../common/modules/cls.module';
import createConfigModule from '../../../../../../common/modules/config.module';
import { cleanupDatabase } from '../../../../../../../prisma/__test__/utils/cleanup';
import { CategoryNotFoundException } from '../../../../../../common/exceptions/404';
import { CategoryHaveArticlesException } from '../../../../../../common/exceptions/403';
import { ARTICLE_REPOSITORY, IArticleRepository } from '../../../../article/repository/article-repo.interface';
import ArticleRepository from '../../../../article/infra/article.repository';
import { createArticle } from '../../../../article/__test__/fixtures/article.fixture';

describe('DeleteCategoryUseCase', () => {
  let sut: DeleteCategoryUseCase;
  let categoryRepository: ICategoryRepository;
  let articleRepository: IArticleRepository;
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
        {
          provide: ARTICLE_REPOSITORY,
          useClass: ArticleRepository,
        },
      ],
    }).compile();

    sut = module.get<DeleteCategoryUseCase>(DeleteCategoryUseCase);
    categoryRepository = module.get<ICategoryRepository>(CATEGORY_REPOSITORY);
    articleRepository = module.get<IArticleRepository>(ARTICLE_REPOSITORY);
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
    const category = createCategory();
    it('예외가 발생한다', async () => {
      await categoryRepository.save(category);
      await articleRepository.save(createArticle({ category }));

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
