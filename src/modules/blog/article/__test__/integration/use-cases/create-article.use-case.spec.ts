import { Test } from '@nestjs/testing';
import CreateArticleUseCase from '../../../use-cases/create-article.use-case';
import ArticleImageService from '../../../services/article-image.service';
import { ARTICLE_REPOSITORY } from '../../../repository/article-repo.interface';
import createClsModule from '../../../../../../common/modules/cls.module';
import createConfigModule from '../../../../../../common/modules/config.module';
import ImageModule from '../../../../../../infra/image/image.module';
import StorageModule from '../../../../../../infra/storage/storage.module';
import { createCreateArticleDto } from '../../fixtures/article-dto.fixture';
import { CategoryNotFoundException } from '../../../../../../common/exceptions/404';
import ArticleRepository from '../../../infra/article.repository';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../../../../category/repository/category-repo.interface';
import CategoryRepository from '../../../../category/infra/category.repository';
import TagService from '../../../../tag/services/tag.service';
import CreateTagUseCase from '../../../../tag/use-cases/create-tag.use-case';
import { TAG_REPOSITORY } from '../../../../tag/repository/tag-repo.interface';
import TagRepository from '../../../../tag/infra/tag.repository';
import { IStorageService, STORAGE_SERVICE } from '../../../../../../infra/storage/interfaces/storage.interface';
import { createCategory } from '../../../../category/__test__/fixtures/create-category.fixture';
import { cleanupDatabase } from '../../../../../../../prisma/__test__/utils/cleanup';
import PrismaService from '../../../../../../infra/database/prisma.service';

describe('CreateArticleUseCase', () => {
  let sut: CreateArticleUseCase;
  let categoryRepository: ICategoryRepository;
  let storageService: IStorageService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [createClsModule(), createConfigModule(), ImageModule, StorageModule],
      providers: [
        CreateArticleUseCase,
        ArticleImageService,
        TagService,
        CreateTagUseCase,
        {
          provide: ARTICLE_REPOSITORY,
          useClass: ArticleRepository,
        },
        {
          provide: CATEGORY_REPOSITORY,
          useClass: CategoryRepository,
        },
        {
          provide: TAG_REPOSITORY,
          useClass: TagRepository,
        },
      ],
    }).compile();

    sut = module.get<CreateArticleUseCase>(CreateArticleUseCase);
    categoryRepository = module.get<ICategoryRepository>(CATEGORY_REPOSITORY);
    storageService = module.get<IStorageService>(STORAGE_SERVICE);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await cleanupDatabase(prisma);
  });

  describe('작성할려고 하는 카테고리가 없으면', () => {
    const categoryId = 1;
    it('예외가 발생한다', async () => {
      await expect(sut.execute({ ...createCreateArticleDto({ categoryId }) })).rejects.toThrow(
        CategoryNotFoundException,
      );
    });
  });

  describe('게시글 정보가 주어지고', () => {
    const createArticleDto = createCreateArticleDto();
    const uploadedUrl = 'uploadedUrl';
    describe('게시글을 생성하면', () => {
      it('게시글 정보를 반환한다', async () => {
        const category = createCategory();
        await categoryRepository.save(category);

        createArticleDto.categoryId = category.getId();

        jest.spyOn(storageService, 'upload').mockResolvedValue(uploadedUrl);

        const result = await sut.execute(createArticleDto);
        expect(result.getTitle()).toBe(createArticleDto.title);
        expect(result.getContent()).toBe(createArticleDto.content);
        expect(result.getVisible()).toBe(createArticleDto.visible);
        expect(result.getThumbnail()).toBe(uploadedUrl);
        expect(result.getCategoryId()).toBe(createArticleDto.categoryId);
        expect(result.getTags().map((tag) => tag.toString())).toEqual(createArticleDto.tags);
      });
    });
  });
});
