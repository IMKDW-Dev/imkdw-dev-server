import { addDays } from 'date-fns';
import { Test } from '@nestjs/testing';

import GetArticlesUseCase from '../../../use-cases/get-articles.use-case';
import { ARTICLE_REPOSITORY, IArticleRepository } from '../../../repository/article-repo.interface';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../../../../category/repository/category-repo.interface';
import { createCategory } from '../../../../category/__test__/fixtures/create-category.fixture';
import { createArticle } from '../../fixtures/article.fixture';
import { createGetArticlesDto } from '../../fixtures/article-dto.fixture';
import { GetArticleSort } from '../../../enums/article.enum';
import ArticleRepository from '../../../infra/article.repository';
import CategoryRepository from '../../../../category/infra/category.repository';
import createClsModule from '../../../../../../common/modules/cls.module';
import { cleanupDatabase } from '../../../../../../../prisma/__test__/utils/cleanup';
import PrismaService from '../../../../../../infra/database/prisma.service';
import { userRoles } from '../../../../../user/domain/models/user-role.model';

describe('GetArticlesUseCase', () => {
  let sut: GetArticlesUseCase;
  let articleRepository: IArticleRepository;
  let categoryRepository: ICategoryRepository;
  let prisma: PrismaService;

  /**
   * 테스트 데이터로 총 2개의 카테고리와 4개의 게시글을 생성한다.
   * 1. 마지막 게시글은 비공개로 설정한다.
   * 2. 1,3번 게시글은 카테고리 1번을 설정한다.
   * 3. 2,4번 게시글은 카테고리 2번을 설정한다.
   */
  const categories = Array.from({ length: 2 }, (_, i) => createCategory({ id: i + 1 }));
  const artciels = Array.from({ length: 4 }, (_, i) =>
    createArticle({
      id: `article-id-${i + 1}`,
      category: i % 2 === 0 ? categories[0] : categories[1],
      title: `article-title-${i + 1}`,
      viewCount: i + 1,
      createdAt: addDays(new Date(), i),
      // 마지막 게시글은 비공개
      visible: i !== 3,
    }),
  );

  const [article1, article2, article3] = artciels;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [createClsModule()],
      providers: [
        GetArticlesUseCase,
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

    sut = module.get<GetArticlesUseCase>(GetArticlesUseCase);
    articleRepository = module.get<IArticleRepository>(ARTICLE_REPOSITORY);
    categoryRepository = module.get<ICategoryRepository>(CATEGORY_REPOSITORY);
    prisma = module.get<PrismaService>(PrismaService);

    await cleanupDatabase(prisma);
    await Promise.all(categories.map((category) => categoryRepository.save(category)));
    await Promise.all(artciels.map((article) => articleRepository.save(article)));
  });

  describe('일반유저가 조회하면', () => {
    const dto = createGetArticlesDto({ userRole: userRoles.normal.name });
    it('3개의 게시글을 반환한다', async () => {
      const result = await sut.execute(dto);
      expect(result.articles.length).toBe(3);
    });
  });

  describe('어드민이 조회하면', () => {
    const dto = createGetArticlesDto({ userRole: userRoles.admin.name });
    it('4개의 게시글을 반환한다', async () => {
      const result = await sut.execute(dto);
      expect(result.articles.length).toBe(4);
    });
  });

  describe('게시글을 최신순으로 조회하면', () => {
    const dto = createGetArticlesDto({ sort: GetArticleSort.LATEST });
    it('3, 2, 1 순으로 게시글을 반환한다', async () => {
      const result = await sut.execute(dto);
      expect(result.articles[0].getTitle()).toBe(article3.getTitle());
      expect(result.articles[1].getTitle()).toBe(article2.getTitle());
      expect(result.articles[2].getTitle()).toBe(article1.getTitle());
    });
  });

  describe('게시글을 인기순으로 조회하면', () => {
    const dto = createGetArticlesDto({ sort: GetArticleSort.POPULAR });
    it('3, 2, 1 순으로 게시글을 반환한다', async () => {
      const result = await sut.execute(dto);
      expect(result.articles[0].getTitle()).toBe(article3.getTitle());
      expect(result.articles[1].getTitle()).toBe(article2.getTitle());
      expect(result.articles[2].getTitle()).toBe(article1.getTitle());
    });
  });

  describe('카테고리 1번 게시글을 조회하면', () => {
    const dto = createGetArticlesDto({ categoryId: categories[0].getId() });
    it('2개의 게시글인 1, 3번 게시글을 반환한다', async () => {
      const result = await sut.execute(dto);
      expect(result.articles.length).toBe(2);
      expect(result.articles[0].getTitle()).toBe(article3.getTitle());
      expect(result.articles[1].getTitle()).toBe(article1.getTitle());
    });
  });

  describe('카테고리 2번 게시글을 조회하면', () => {
    const dto = createGetArticlesDto({ categoryId: categories[1].getId() });
    it('1개의 게시글인 2번 게시글을 반환한다', async () => {
      const result = await sut.execute(dto);
      expect(result.articles.length).toBe(1);
      expect(result.articles[0].getTitle()).toBe(article2.getTitle());
    });
  });

  describe('1번 게시글을 제외하고 조회하면', () => {
    const dto = createGetArticlesDto({ excludeId: article1.getId().toString() });
    it('2, 3번 게시글을 반환한다', async () => {
      const result = await sut.execute(dto);
      expect(result.articles.length).toBe(2);
      expect(result.articles[0].getTitle()).toBe(article3.getTitle());
      expect(result.articles[1].getTitle()).toBe(article2.getTitle());
    });
  });

  describe('검색어가 article-title-2인 게시글을 조회하면', () => {
    const dto = createGetArticlesDto({ search: 'article-title-2' });
    it('2번 게시글을 반환한다', async () => {
      const result = await sut.execute(dto);
      expect(result.articles.length).toBe(1);
      expect(result.articles[0].getTitle()).toBe(article2.getTitle());
    });
  });
});
