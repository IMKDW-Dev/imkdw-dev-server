import { Test } from '@nestjs/testing';
import ArticleService from '../../../services/article.service';
import { ARTICLE_REPOSITORY } from '../../../repository/article-repo.interface';
import ArticleRepository from '../../../infra/article.repository';
import { COMMENT_REPOSITORY } from '../../../../comment/repository/comment-repo.interface';
import { TAG_REPOSITORY } from '../../../../tag/repository/tag-repo.interface';
import TagRepository from '../../../../tag/infra/tag.repository';
import ArticleImageService from '../../../services/article-image.service';
import createClsModule from '../../../../../../common/modules/cls.module';
import createConfigModule from '../../../../../../common/modules/config.module';
import CreateArticleUseCase from '../../../use-cases/create-article.use-case';
import UpdateArticleUseCase from '../../../use-cases/update-article.use-case';
import IncreaseViewCountUseCase from '../../../use-cases/increate-view-count.use-case';
import DeleteArticleUseCase from '../../../use-cases/delete-article.use-case';
import GetArticleDetailUseCase from '../../../use-cases/get-article-detail.use-case';
import GetArticlesUseCase from '../../../use-cases/get-articles.use-case';
import ImageModule from '../../../../../../infra/image/image.module';
import StorageModule from '../../../../../../infra/storage/storage.module';
import { CATEGORY_REPOSITORY } from '../../../../category/repository/category-repo.interface';
import CategoryRepository from '../../../../category/infra/category.repository';
import TagService from '../../../../tag/services/tag.service';
import CreateTagUseCase from '../../../../tag/use-cases/create-tag.use-case';

describe('ArticleService', () => {
  let sut: ArticleService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [createClsModule(), createConfigModule(), ImageModule, StorageModule],
      providers: [
        ArticleService,
        ArticleImageService,
        CreateArticleUseCase,
        UpdateArticleUseCase,
        IncreaseViewCountUseCase,
        DeleteArticleUseCase,
        GetArticleDetailUseCase,
        GetArticlesUseCase,
        TagService,
        CreateTagUseCase,
        {
          provide: ARTICLE_REPOSITORY,
          useClass: ArticleRepository,
        },
        {
          provide: COMMENT_REPOSITORY,
          useClass: ArticleRepository,
        },
        {
          provide: TAG_REPOSITORY,
          useClass: TagRepository,
        },
        {
          provide: CATEGORY_REPOSITORY,
          useClass: CategoryRepository,
        },
      ],
    }).compile();

    sut = module.get<ArticleService>(ArticleService);
  });

  it('defined', () => {
    expect(sut).toBeDefined();
  });
});
