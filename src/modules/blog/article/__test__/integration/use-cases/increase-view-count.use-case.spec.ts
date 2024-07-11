import { Test } from '@nestjs/testing';
import IncreaseViewCountUseCase from '../../../use-cases/increate-view-count.use-case';
import { ARTICLE_REPOSITORY, IArticleRepository } from '../../../repository/article-repo.interface';
import ArticleRepository from '../../../infra/article.repository';
import { ArticleNotFoundException } from '../../../../../../common/exceptions/404';
import { userRoles } from '../../../../../user/domain/models/user-role.model';
import { createArticle } from '../../fixtures/article.fixture';
import { createCategory } from '../../../../category/__test__/fixtures/create-category.fixture';
import createClsModule from '../../../../../../common/modules/cls.module';
import { cleanupDatabase } from '../../../../../../../prisma/__test__/utils/cleanup';
import PrismaService from '../../../../../../infra/database/prisma.service';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../../../../category/repository/category-repo.interface';
import CategoryRepository from '../../../../category/infra/category.repository';

describe('IncreaseViewCountUseCase', () => {
  let sut: IncreaseViewCountUseCase;
  let categoryRepository: ICategoryRepository;
  let articleRepository: IArticleRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [createClsModule()],
      providers: [
        IncreaseViewCountUseCase,
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

    sut = module.get<IncreaseViewCountUseCase>(IncreaseViewCountUseCase);
    articleRepository = module.get<IArticleRepository>(ARTICLE_REPOSITORY);
    categoryRepository = module.get<ICategoryRepository>(CATEGORY_REPOSITORY);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await cleanupDatabase(prisma);
  });

  describe('조회수를 증가시킬 게시글이 없는 경우', () => {
    it('예외가 발생한다', async () => {
      await expect(sut.execute({ articleId: 'articleId', userRole: userRoles.admin.name })).rejects.toThrow(
        ArticleNotFoundException,
      );
    });
  });

  describe('비공개 게시글에', () => {
    const category = createCategory();
    const article = createArticle({ category, visible: false });

    describe('일반 유저가 조회수 증가 요청시', () => {
      it('예외가 발생한다', async () => {
        await categoryRepository.save(category);
        await articleRepository.save(article);

        await expect(
          sut.execute({ articleId: article.getId().toString(), userRole: userRoles.normal.name }),
        ).rejects.toThrow(ArticleNotFoundException);
      });
    });
  });

  describe('조회수 1인 게시글에', () => {
    const category = createCategory();
    const article = createArticle({ category, visible: true, viewCount: 1 });

    describe('조회수를 증가시킬경우', () => {
      it('조회수는 2가 된다', async () => {
        await categoryRepository.save(category);
        await articleRepository.save(article);

        await sut.execute({ articleId: article.getId().toString(), userRole: userRoles.normal.name });

        const updatedArticle = await articleRepository.findOne({ articleId: article.getId().toString() });
        expect(updatedArticle.getViewCount()).toBe(2);
      });
    });
  });
});
