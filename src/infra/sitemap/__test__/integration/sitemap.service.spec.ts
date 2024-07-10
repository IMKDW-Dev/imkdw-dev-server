import { Test } from '@nestjs/testing';
import SitemapService from '../../services/sitemap.service';
import createClsModule from '../../../../common/modules/cls.module';
import PrismaService from '../../../database/prisma.service';
import { createCategory } from '../../../../modules/blog/category/__test__/fixtures/create-category.fixture';
import { createArticle } from '../../../../modules/blog/article/__test__/fixtures/article.fixture';
import { cleanupDatabase } from '../../../../../prisma/__test__/utils/cleanup';

describe('SitemapService', () => {
  let sut: SitemapService;
  let prisma: PrismaService;

  const createTestData = async (_prisma: PrismaService) => {
    const categories = Array.from({ length: 2 }, (_, i) => createCategory({ id: i + 1, name: `name-${i + 1}` }));
    const visibleArticles = Array.from({ length: 5 }, (_, i) =>
      createArticle({
        id: `visible-article-id-${i + 1}`,
        category: i % 2 === 0 ? categories[0] : categories[1],
        title: `visible-article-title-${i + 1}`,
        visible: true,
      }),
    ).map((article) => ({
      id: article.getId().toString(),
      title: article.getTitle(),
      content: article.getContent(),
      visible: article.getVisible(),
      thumbnail: article.getThumbnail(),
      categoryId: article.getCategoryId(),
    }));

    const invisibleArticles = Array.from({ length: 3 }, (_, i) =>
      createArticle({
        id: `invisible-article-id-${i + 1}`,
        category: i % 2 === 0 ? categories[0] : categories[1],
        title: `invisible-article-title-${i + 1}`,
        visible: false,
      }),
    ).map((article) => ({
      id: article.getId().toString(),
      title: article.getTitle(),
      content: article.getContent(),
      visible: article.getVisible(),
      thumbnail: article.getThumbnail(),
      categoryId: article.getCategoryId(),
    }));

    await _prisma.categories.createMany({
      data: categories.map((category) => ({
        id: category.getId(),
        name: category.getName(),
        desc: category.getDesc(),
        image: category.getImage(),
        sort: category.getSort(),
        articleCount: category.getArticleCount(),
      })),
    });

    await Promise.all([
      _prisma.articles.createMany({ data: visibleArticles }),
      _prisma.articles.createMany({ data: invisibleArticles }),
    ]);
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [createClsModule()],
      providers: [SitemapService],
    }).compile();

    sut = module.get<SitemapService>(SitemapService);
    prisma = module.get<PrismaService>(PrismaService);

    await cleanupDatabase(prisma);
    await createTestData(prisma);
  });

  describe('게시글 아이디 목록을 조회하면', () => {
    it('5개의 게시글 아이디 목록을 반환한다', async () => {
      const result = await sut.getArticleIds();

      expect(result).toHaveLength(5);
      expect(result).toEqual([
        'visible-article-id-1',
        'visible-article-id-2',
        'visible-article-id-3',
        'visible-article-id-4',
        'visible-article-id-5',
      ]);
    });
  });

  describe('카테고리 이름 목록을 조회하면', () => {
    it('2개의 카테고리 이름 목록을 반환한다', async () => {
      const result = await sut.getCategoryNames();

      expect(result).toHaveLength(2);
      expect(result).toEqual(['name-1', 'name-2']);
    });
  });
});
