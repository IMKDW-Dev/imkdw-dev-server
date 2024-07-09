import { Test } from '@nestjs/testing';
import createClsModule from '../../../../../../common/modules/cls.module';
import CommentRepository from '../../../infra/comment.repository';
import { COMMENT_REPOSITORY } from '../../../repository/comment-repo.interface';
import CommentService from '../../../services/comment.service';
import CreateCommentUseCase from '../../../use-cases/create-comment.use-case';
import ImageModule from '../../../../../../infra/image/image.module';
import StorageModule from '../../../../../../infra/storage/storage.module';
import createConfigModule from '../../../../../../common/modules/config.module';
import UserService from '../../../../../user/services/user.service';
import UpdateUserUseCase from '../../../../../user/use-cases/update-user.use-case';
import CreateUserUseCase from '../../../../../user/use-cases/create-user.use-case';
import GetUserInfoUseCase from '../../../../../user/use-cases/get-user-info.use-case';
import UserImageService from '../../../../../user/services/user-image.service';
import { ARTICLE_REPOSITORY } from '../../../../article/repository/article-repo.interface';
import ArticleRepository from '../../../../article/infra/article.repository';
import { USER_REPOSITORY } from '../../../../../user/interfaces/user-repo.interface';
import UserRepository from '../../../../../user/infra/user.repository';
import { CATEGORY_REPOSITORY } from '../../../../category/repository/category-repo.interface';
import CategoryRepository from '../../../../category/infra/category.repository';

describe('CommentService', () => {
  let sut: CommentService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [createClsModule(), ImageModule, StorageModule, createConfigModule()],
      providers: [
        CommentService,
        CreateCommentUseCase,
        UserService,
        CreateUserUseCase,
        UpdateUserUseCase,
        GetUserInfoUseCase,
        UserImageService,
        {
          provide: COMMENT_REPOSITORY,
          useClass: CommentRepository,
        },
        {
          provide: ARTICLE_REPOSITORY,
          useClass: ArticleRepository,
        },
        {
          provide: USER_REPOSITORY,
          useClass: UserRepository,
        },
        {
          provide: CATEGORY_REPOSITORY,
          useClass: CategoryRepository,
        },
      ],
    }).compile();

    sut = module.get<CommentService>(CommentService);
  });

  it('defined', () => {
    expect(sut).toBeDefined();
  });
});
