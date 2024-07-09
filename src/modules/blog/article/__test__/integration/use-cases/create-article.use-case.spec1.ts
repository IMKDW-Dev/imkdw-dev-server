import { Test } from '@nestjs/testing';
import CreateArticleUseCase from '../../../use-cases/create-article.use-case';
import ArticleImageService from '../../../services/article-image.service';
import ArticleTagService from '../../../services/article-tag.service';
import { ARTICLE_REPOSITORY, IArticleRepository } from '../../../repository/article-repo.interface';
import ArticleRepository from '../../../infra/article.repository';
import CategoryValidatorService from '../../../../category/services/category-validator.service';
import CategoryCounterService from '../../../../category/services/category-counter.service';
import { CATEGORY_REPOSITORY } from '../../../../category/repository/category-repo.interface';
import CategoryRepository from '../../../../category/infra/category.repository';
import createClsModule from '../../../../../../common/modules/cls.module';
import createConfigModule from '../../../../../../common/modules/config.module';
import ImageModule from '../../../../../../infra/image/image.module';
import StorageModule from '../../../../../../infra/storage/storage.module';
import { ARTICLE_TAG_REPOSITORY } from '../../../repository/article-tag-repo.inteface';
import ArticleTagRepository from '../../../infra/article-tag.repository';
import TagService from '../../../../tag/services/tag.service';
import { TAG_REPOSITORY } from '../../../../tag/repository/tag-repo.interface';
import TagRepository from '../../../../tag/infra/tag.repository';

describe('CreateArticleUseCase', () => {
  let sut: CreateArticleUseCase;
  let articleRepository: IArticleRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [createClsModule(), createConfigModule(), ImageModule, StorageModule],
      providers: [
        CreateArticleUseCase,
        ArticleImageService,
        ArticleTagService,
        CategoryValidatorService,
        CategoryCounterService,
        TagService,
        {
          provide: ARTICLE_REPOSITORY,
          useClass: ArticleRepository,
        },
        {
          provide: CATEGORY_REPOSITORY,
          useClass: CategoryRepository,
        },
        {
          provide: ARTICLE_TAG_REPOSITORY,
          useClass: ArticleTagRepository,
        },
        {
          provide: TAG_REPOSITORY,
          useClass: TagRepository,
        },
      ],
    }).compile();

    sut = module.get<CreateArticleUseCase>(CreateArticleUseCase);
    articleRepository = module.get<IArticleRepository>(ARTICLE_REPOSITORY);
  });

  it('defined', () => {
    expect(sut).toBeDefined();
  });
});
