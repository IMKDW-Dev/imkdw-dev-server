import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import UpdateArticleUseCase from '../../../use-cases/update-article.use-case';
import createClsModule from '../../../../../../common/modules/cls.module';
import createConfigModule from '../../../../../../common/modules/config.module';
import { createUpdateArticleDto } from '../../fixtures/article-dto.fixture';
import { ArticleNotFoundException, CategoryNotFoundException } from '../../../../../../common/exceptions/404';
import { ARTICLE_REPOSITORY, IArticleRepository } from '../../../repository/article-repo.interface';
import ArticleRepository from '../../../infra/article.repository';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../../../../category/repository/category-repo.interface';
import CategoryRepository from '../../../../category/infra/category.repository';
import ArticleImageService from '../../../services/article-image.service';
import StorageModule from '../../../../../../infra/storage/storage.module';
import ImageModule from '../../../../../../infra/image/image.module';
import { generateMulterFile } from '../../../../../../__test__/fixtures/create-multer-file.fixture';
import { IStorageService, STORAGE_SERVICE } from '../../../../../../infra/storage/interfaces/storage.interface';
import { createArticle } from '../../fixtures/article.fixture';
import { createCategory } from '../../../../category/__test__/fixtures/create-category.fixture';
import { cleanupDatabase } from '../../../../../../../prisma/__test__/utils/cleanup';
import PrismaService from '../../../../../../infra/database/prisma.service';

describe('UpdateArticleUseCase', () => {
  let sut: UpdateArticleUseCase;
  let articleRepository: IArticleRepository;
  let storageService: IStorageService;
  let categoryRepository: ICategoryRepository;
  let prisma: PrismaService;
  let configService: ConfigService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [createClsModule(), createConfigModule(), StorageModule, ImageModule],
      providers: [
        UpdateArticleUseCase,
        ArticleImageService,
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

    sut = module.get<UpdateArticleUseCase>(UpdateArticleUseCase);
    articleRepository = module.get<IArticleRepository>(ARTICLE_REPOSITORY);
    storageService = module.get<IStorageService>(STORAGE_SERVICE);
    categoryRepository = module.get<ICategoryRepository>(CATEGORY_REPOSITORY);
    prisma = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);
  });

  beforeEach(async () => {
    await cleanupDatabase(prisma);
  });

  describe('수정할려고 하는 게시글이 존재하지 않는 경우', () => {
    const dto = createUpdateArticleDto();
    it('예외가 발생한다', async () => {
      await expect(sut.execute(dto)).rejects.toThrow(ArticleNotFoundException);
    });
  });

  describe('썸네일을 수정하는 경우', () => {
    const dto = createUpdateArticleDto({ thumbnail: generateMulterFile() });
    const uploadedUrl = 'uploadedUrl';
    it('썸네일을 저장하고 게시글 썸네일을 수정한다', async () => {
      const category = createCategory();
      await categoryRepository.save(category);

      const article = createArticle({ category });
      await articleRepository.save(article);

      dto.articleId = article.getId().toString();

      jest.spyOn(storageService, 'upload').mockResolvedValue(uploadedUrl);

      const updatedArticle = await sut.execute(dto);
      expect(updatedArticle.getThumbnail()).toBe(uploadedUrl);
    });
  });

  describe('카테고리를 수정하는 경우', () => {
    describe('수정할 카테고리가 존재하지 않으면', () => {
      const category = createCategory();
      const article = createArticle({ category });
      it('예외가 발생한다', async () => {
        await categoryRepository.save(category);
        await articleRepository.save(article);

        const dto = createUpdateArticleDto({ categoryId: 99 });
        await expect(sut.execute(dto)).rejects.toThrow(CategoryNotFoundException);
      });
    });

    describe('수정할 카테고리가 존재하는 경우', () => {
      const category1 = createCategory({ name: 'name1' });
      const category2 = createCategory({ name: 'name2' });
      const article = createArticle({ category: category1 });
      it('게시글 카테고리를 수정한다', async () => {
        await categoryRepository.save(category1);
        await categoryRepository.save(category2);
        await articleRepository.save(article);

        const dto = createUpdateArticleDto({ categoryId: category2.getId() });

        const updatedArticle = await sut.execute(dto);
        expect(updatedArticle.getCategory().getId()).toBe(category2.getId());
      });
    });
  });

  describe('업로드된 이미지가 있다면', () => {
    const category = createCategory();
    const article = createArticle({ category });
    const images = ['image1.jpg'];
    it('이미지를 저장하고 게시글 이미지를 수정한다', async () => {
      await categoryRepository.save(category);

      jest.spyOn(storageService, 'copyFile').mockResolvedValue(null);
      const fromPath = `${configService.get<string>('S3_PRESIGNED_BUCKET_URL')}/image1.jpg`;
      const toPath = `articles/${article.getId()}/content-images/image1.jpg`;
      article.changeContent(fromPath);
      await articleRepository.save(article);

      const updatedArticle = await sut.execute(
        createUpdateArticleDto({ images, articleId: article.getId().toString(), content: article.getContent() }),
      );
      expect(updatedArticle.getContent().includes(toPath)).toBeTruthy();
    });
  });
});
