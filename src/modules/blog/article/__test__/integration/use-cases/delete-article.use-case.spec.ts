import { Test } from '@nestjs/testing';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../../../../category/repository/category-repo.interface';
import DeleteArticleUseCase from '../../../use-cases/delete-article.use-case';
import createClsModule from '../../../../../../common/modules/cls.module';
import { ARTICLE_REPOSITORY, IArticleRepository } from '../../../repository/article-repo.interface';
import ArticleRepository from '../../../infra/article.repository';
import CategoryRepository from '../../../../category/infra/category.repository';
import { cleanupDatabase } from '../../../../../../../prisma/__test__/utils/cleanup';
import PrismaService from '../../../../../../infra/database/prisma.service';
import { ArticleNotFoundException } from '../../../../../../common/exceptions/404';
import { createArticle } from '../../fixtures/article.fixture';
import { createCategory } from '../../../../category/__test__/fixtures/create-category.fixture';

describe('DeleteArticleUseCase', () => {
  let sut: DeleteArticleUseCase;
  let articleRepository: IArticleRepository;
  let categoryRepository: ICategoryRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [createClsModule()],
      providers: [
        DeleteArticleUseCase,
        {
          provide: ARTICLE_REPOSITORY,
          useClass: ArticleRepository,
        },
        {
          provide: CATEGORY_REPOSITORY,
          useClass: CategoryRepository,
        },
      ],
    }).compile();

    sut = module.get<DeleteArticleUseCase>(DeleteArticleUseCase);
    articleRepository = module.get<IArticleRepository>(ARTICLE_REPOSITORY);
    categoryRepository = module.get<ICategoryRepository>(CATEGORY_REPOSITORY);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await cleanupDatabase(prisma);
  });

  describe('삭제할 게시글이 존재하지 않는 경우', () => {
    it('예외가 발생한다', async () => {
      await expect(sut.execute('articleId')).rejects.toThrow(ArticleNotFoundException);
    });
  });

  describe('삭제할 게시글이 존재하는 경우', () => {
    const category = createCategory();
    const article = createArticle({ category });

    it('게시글을 삭제한다', async () => {
      await categoryRepository.save(category);
      await articleRepository.save(article);

      await sut.execute(article.getId().toString());

      const deleteArticle = await articleRepository.findOne({ articleId: article.getId().toString() });
      expect(deleteArticle).toBeNull();
    });
  });
});
