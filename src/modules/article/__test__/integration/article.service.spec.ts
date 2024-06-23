import { Test } from '@nestjs/testing';
import { CustomPrismaService } from 'nestjs-prisma';

import ArticleService from '../../services/article/article.service';
import AppModule from '../../../../app.module';
import { generateCreateArticleDto } from '../mothers/article.test-mother';
import { generateMulterFile } from '../../../../__test__/mothers/common.test-mother';
import { CategoryNotFoundException } from '../../../../common/exceptions/404';
import { DuplicateArticleIdException } from '../../../../common/exceptions/409';
import Article from '../../domain/entities/article.entity';
import { ARTICLE_REPOSITORY, IArticleRepository } from '../../repository/article/article-repo.interface';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../../../category/repository/category-repo.interface';
import { createCategory } from '../../../category/__test__/mothers/category.test-mother';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../../infra/database/prisma';
import { cleanupDatabase } from '../../../../../prisma/__test__/utils/cleanup';
import ArticleImageService from '../../services/article/article-image.service';

describe('ArticleModule', () => {
  let articleService: ArticleService;
  let articleRepository: IArticleRepository;
  let categoryRepository: ICategoryRepository;
  let prisma: CustomPrismaService<ExtendedPrismaClient>;
  let articleImageService: ArticleImageService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    articleService = module.get<ArticleService>(ArticleService);
    articleRepository = module.get<IArticleRepository>(ARTICLE_REPOSITORY);
    categoryRepository = module.get<ICategoryRepository>(CATEGORY_REPOSITORY);
    prisma = module.get<CustomPrismaService<ExtendedPrismaClient>>(PRISMA_SERVICE);
    articleImageService = module.get<ArticleImageService>(ArticleImageService);
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
        const category = await categoryRepository.save(createCategory());

        const dto = generateCreateArticleDto({ categoryId: category.id });
        const file = generateMulterFile();

        jest.spyOn(articleRepository, 'findOne').mockResolvedValueOnce(Article.create({}));

        // When, Then
        await expect(articleService.createArticle(dto, file)).rejects.toThrow(DuplicateArticleIdException);
      });

      it('생성된 게시글을 반환한다', async () => {
        // Given
        const category = await categoryRepository.save(createCategory());

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
          const category = await categoryRepository.save(createCategory());

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
  });
});
