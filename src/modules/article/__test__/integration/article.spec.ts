import { Test } from '@nestjs/testing';
import { CustomPrismaService } from 'nestjs-prisma';

import ArticleService from '../../services/article/article.service';
import AppModule from '../../../../app.module';
import {
  generateArticle,
  generateArticleContent,
  generateArticleId,
  generateCreateArticleDto,
} from '../mothers/article.test-mother';
import { generateMulterFile } from '../../../../__test__/mothers/common.test-mother';
import { ArticleNotFoundException, CategoryNotFoundException } from '../../../../common/exceptions/404';
import { DuplicateArticleIdException } from '../../../../common/exceptions/409';
import Article from '../../domain/entities/article.entity';
import { ARTICLE_REPOSITORY, IArticleRepository } from '../../repository/article/article-repo.interface';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../../../category/repository/category-repo.interface';
import { generateCategory } from '../../../category/__test__/mothers/category.test-mother';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../../infra/database/prisma';
import { cleanupDatabase } from '../../../../../prisma/__test__/utils/cleanup';
import ArticleImageService from '../../services/article/article-image.service';
import UserRoles from '../../../user/enums/user-role.enum';
import { generateTag } from '../../../tag/__test__/mothers/tag.test-mother';
import { ITagRepository, TAG_REPOSITORY } from '../../../tag/repository/tag-repo.interface';
import {
  ARTICLE_TAG_REPOSITORY,
  IArticleTagRepository,
} from '../../../articleTag/repository/article-tag-repo.inteface';
import { generateArticleTags } from '../../../articleTag/__test__/mothers/article-tag.test-mother';

describe('Article', () => {
  let articleService: ArticleService;
  let articleRepository: IArticleRepository;
  let categoryRepository: ICategoryRepository;
  let prisma: CustomPrismaService<ExtendedPrismaClient>;
  let articleImageService: ArticleImageService;
  let tagRepository: ITagRepository;
  let articleTagRepository: IArticleTagRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    articleService = module.get<ArticleService>(ArticleService);
    articleRepository = module.get<IArticleRepository>(ARTICLE_REPOSITORY);
    categoryRepository = module.get<ICategoryRepository>(CATEGORY_REPOSITORY);
    prisma = module.get<CustomPrismaService<ExtendedPrismaClient>>(PRISMA_SERVICE);
    articleImageService = module.get<ArticleImageService>(ArticleImageService);
    tagRepository = module.get<ITagRepository>(TAG_REPOSITORY);
    articleTagRepository = module.get<IArticleTagRepository>(ARTICLE_TAG_REPOSITORY);
  });

  afterEach(async () => {
    await cleanupDatabase(prisma);
  });

  describe('ArticleService', () => {
    describe('게시글 생성', () => {
      it('카테고리가 없는경우 CategoryNotFoundException 예외가 발생한다', async () => {
        // Given
        const dto = generateCreateArticleDto();
        const file = generateMulterFile();

        // When, Then
        await expect(articleService.createArticle(dto, file)).rejects.toThrow(CategoryNotFoundException);
      });

      it('이미 동일한 아이디의 게시글이 존재하는 경우 DuplicateArticleIdException 예외가 발생한다', async () => {
        // Given
        const category = await categoryRepository.save(generateCategory());

        const dto = generateCreateArticleDto({ categoryId: category.id });
        const file = generateMulterFile();

        jest.spyOn(articleRepository, 'findOne').mockResolvedValueOnce(Article.create({}));

        // When, Then
        await expect(articleService.createArticle(dto, file)).rejects.toThrow(DuplicateArticleIdException);
      });

      it('생성된 게시글을 반환한다', async () => {
        // Given
        const category = await categoryRepository.save(generateCategory());

        const dto = generateCreateArticleDto({ categoryId: category.id });
        const file = generateMulterFile();

        jest.spyOn(articleImageService, 'getThumbnail').mockResolvedValueOnce('thumbnail');

        // When
        const sut = await articleService.createArticle(dto, file);

        // Then
        expect(sut).toBeInstanceOf(Article);
        expect(sut.title).toBe(dto.title);
        expect(sut.content.getContent()).toBe(dto.content);
        expect(sut.thumbnail).toBe('thumbnail');
        expect(sut.category).toEqual(category);
      });

      describe('업로드된 이미지가 있는 경우', () => {
        it('이미지가 복사되고 복사된 이미지 URL이 게시글 내용에 대체된다', async () => {
          // Given
          const category = await categoryRepository.save(generateCategory());

          const dto = generateCreateArticleDto({ categoryId: category.id });
          const file = generateMulterFile();

          jest.spyOn(articleImageService, 'getThumbnail').mockResolvedValueOnce('thumbnail');
          jest
            .spyOn(articleImageService, 'copyContentImages')
            .mockResolvedValueOnce([{ fromPath: 'fromPath', toPath: 'toPath' }]);

          // When
          const sut = await articleService.createArticle(dto, file);

          // Then
          expect(sut).toBeInstanceOf(Article);
          expect(sut.title).toBe(dto.title);
          expect(sut.content.getContent()).toBe(dto.content);
          expect(sut.thumbnail).toBe('thumbnail');
          expect(sut.category).toEqual(category);
        });
      });
    });

    describe('게시글 상세정보 조회', () => {
      it('게시글이 없는경우 ArticleNotFoundException 예외가 발생한다', async () => {
        // Given
        const articleId = 'articleId';
        const userRole = UserRoles.NORMAL;
        jest.spyOn(articleRepository, 'findOne').mockResolvedValueOnce(null);

        // When, Then
        await expect(articleService.getArticleDetail(articleId, userRole)).rejects.toThrow(ArticleNotFoundException);
      });

      it('게시글 상세정보를 반환한다', async () => {
        // Given
        const category = await categoryRepository.save(generateCategory());
        const tags = await tagRepository.createMany([generateTag()]);

        const id = generateArticleId();
        const content = generateArticleContent();
        const article = generateArticle({ id, category, content, tags });
        await articleRepository.save(article);

        const articleTags = generateArticleTags(article, tags);
        await articleTagRepository.createMany(article, articleTags);

        // When
        const sut = await articleService.getArticleDetail(id.toString(), UserRoles.NORMAL);

        // Then
        expect(sut.id).toEqual(id.toString());
        expect(sut.title).toEqual(article.title);
        expect(sut.content).toEqual(article.content.getContent());
        expect(sut.thumbnail).toEqual(article.thumbnail);
        expect(sut.category).toEqual(article.category);
        expect(sut.tags).toEqual(tags.map((tag) => ({ id: tag.id, name: tag.name })));
      });
    });
  });
});
