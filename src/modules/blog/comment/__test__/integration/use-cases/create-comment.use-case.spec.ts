import { Test } from '@nestjs/testing';
import CreateCommentUseCase from '../../../use-cases/create-comment.use-case';
import createClsModule from '../../../../../../common/modules/cls.module';
import { COMMENT_REPOSITORY, ICommentRepository } from '../../../repository/comment-repo.interface';
import CommentRepository from '../../../infra/comment.repository';
import { createCreateCommentDto } from '../../fixtures/comment-dto.fixture';
import UserService from '../../../../../user/services/user.service';
import { createUser } from '../../../../../user/__test__/fixtures/create-user.fixture';
import { ArticleNotFoundException } from '../../../../../../common/exceptions/404';
import { cleanupDatabase } from '../../../../../../../prisma/__test__/utils/cleanup';
import PrismaService from '../../../../../../infra/database/prisma.service';
import { ARTICLE_REPOSITORY, IArticleRepository } from '../../../../article/repository/article-repo.interface';
import ArticleRepository from '../../../../article/infra/article.repository';
import { IUserRepository, USER_REPOSITORY } from '../../../../../user/interfaces/user-repo.interface';
import UserRepository from '../../../../../user/infra/user.repository';
import CreateUserUseCase from '../../../../../user/use-cases/create-user.use-case';
import UpdateUserUseCase from '../../../../../user/use-cases/update-user.use-case';
import GetUserInfoUseCase from '../../../../../user/use-cases/get-user-info.use-case';
import UserImageService from '../../../../../user/services/user-image.service';
import ImageModule from '../../../../../../infra/image/image.module';
import StorageModule from '../../../../../../infra/storage/storage.module';
import createConfigModule from '../../../../../../common/modules/config.module';
import { createCategory } from '../../../../category/__test__/fixtures/create-category.fixture';
import { createArticle } from '../../../../article/__test__/fixtures/article.fixture';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../../../../category/repository/category-repo.interface';
import CategoryRepository from '../../../../category/infra/category.repository';
import { createComment } from '../../fixtures/comment.fixture';
import { CannotReplyOnReplyCommentException } from '../../../../../../common/exceptions/403';
import Comment from '../../../domain/models/comment.model';

describe('CreateCommentUseCase', () => {
  let sut: CreateCommentUseCase;
  let prisma: PrismaService;
  let articleRepository: IArticleRepository;
  let categoryRepository: ICategoryRepository;
  let commentRepository: ICommentRepository;
  let userRepository: IUserRepository;

  const user = createUser();
  const category = createCategory();
  const article = createArticle({ category });

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [createClsModule(), ImageModule, StorageModule, createConfigModule()],
      providers: [
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

    sut = module.get<CreateCommentUseCase>(CreateCommentUseCase);
    prisma = module.get<PrismaService>(PrismaService);
    articleRepository = module.get<IArticleRepository>(ARTICLE_REPOSITORY);
    categoryRepository = module.get<ICategoryRepository>(CATEGORY_REPOSITORY);
    commentRepository = module.get<ICommentRepository>(COMMENT_REPOSITORY);
    userRepository = module.get<IUserRepository>(USER_REPOSITORY);

    await cleanupDatabase(prisma);
  });

  afterEach(async () => {
    await cleanupDatabase(prisma);
    await categoryRepository.save(category);
    await articleRepository.save(article);
    await userRepository.save(user);
  });

  describe('댓글을 작성할 게시글이 없으면', () => {
    const dto = createCreateCommentDto({ userId: user.getId(), articleId: 'afasdadafa' });
    it('예외가 발생한다', async () => {
      await expect(sut.execute(dto)).rejects.toThrow(ArticleNotFoundException);
    });
  });

  describe('답글에 답글을 작성하면', () => {
    const comment1 = createComment({ id: 1, author: user, articleId: article.getId().toString() });
    const comment2 = createComment({
      id: 2,
      author: user,
      articleId: article.getId().toString(),
      parentId: comment1.getId(),
    });
    const dto = createCreateCommentDto({
      userId: user.getId(),
      articleId: article.getId().toString(),
      parentId: comment2.getId(),
    });

    it('예외가 발생한다', async () => {
      await commentRepository.save(comment1);
      await commentRepository.save(comment2);

      await expect(sut.execute(dto)).rejects.toThrow(CannotReplyOnReplyCommentException);
    });
  });

  describe('댓글을 작성하면', () => {
    const dto = createCreateCommentDto({
      userId: user.getId(),
      articleId: article.getId().toString(),
    });
    it('작성된 댓글을 반환한다', async () => {
      const result = await sut.execute(dto);
      expect(result.getContent()).toBe(dto.content);
    });
  });

  describe('답글을 작성하면', () => {
    const comment1 = createComment({ id: 1, author: user, articleId: article.getId().toString() });
    const dto = createCreateCommentDto({
      userId: user.getId(),
      articleId: article.getId().toString(),
      parentId: comment1.getId(),
    });

    let result: Comment;
    beforeAll(async () => {
      await commentRepository.save(comment1);
      result = await sut.execute(dto);
    });

    it('작성된 댓글을 반환한다', async () => {
      expect(result.getContent()).toBe(dto.content);

      const parent = await commentRepository.findMany({});
      expect(parent[0].getReplies().length).toBe(1);
      expect(parent[0].getReplies()[0].getContent()).toBe(dto.content);
    });
  });
});
