import { Test } from '@nestjs/testing';
import { cleanupDatabase } from '../../../../../../../prisma/__test__/utils/cleanup';
import createClsModule from '../../../../../../common/modules/cls.module';
import PrismaService from '../../../../../../infra/database/prisma.service';
import CategoryRepository from '../../../../category/infra/category.repository';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../../../../category/repository/category-repo.interface';
import ArticleRepository from '../../../infra/article.repository';
import { ARTICLE_REPOSITORY, IArticleRepository } from '../../../repository/article-repo.interface';
import GetArticleDetailUseCase from '../../../use-cases/get-article-detail.use-case';
import { ArticleNotFoundException } from '../../../../../../common/exceptions/404';
import { userRoles } from '../../../../../user/domain/models/user-role.model';
import { createCategory } from '../../../../category/__test__/fixtures/create-category.fixture';
import { createArticle } from '../../fixtures/article.fixture';
import { COMMENT_REPOSITORY, ICommentRepository } from '../../../../comment/repository/comment-repo.interface';
import CommentRepository from '../../../../comment/infra/comment.repository';
import { createComment } from '../../../../comment/__test__/fixtures/comment.fixture';
import { createUser } from '../../../../../user/__test__/fixtures/create-user.fixture';
import { IUserRepository, USER_REPOSITORY } from '../../../../../user/interfaces/user-repo.interface';
import UserRepository from '../../../../../user/infra/user.repository';

describe('GetArticleDetailUseCase', () => {
  let sut: GetArticleDetailUseCase;
  let categoryRepository: ICategoryRepository;
  let articleRepository: IArticleRepository;
  let commentRepository: ICommentRepository;
  let userRepository: IUserRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [createClsModule()],
      providers: [
        GetArticleDetailUseCase,
        {
          provide: ARTICLE_REPOSITORY,
          useClass: ArticleRepository,
        },
        {
          provide: CATEGORY_REPOSITORY,
          useClass: CategoryRepository,
        },
        {
          provide: COMMENT_REPOSITORY,
          useClass: CommentRepository,
        },
        {
          provide: USER_REPOSITORY,
          useClass: UserRepository,
        },
      ],
    }).compile();

    sut = module.get<GetArticleDetailUseCase>(GetArticleDetailUseCase);
    articleRepository = module.get<IArticleRepository>(ARTICLE_REPOSITORY);
    categoryRepository = module.get<ICategoryRepository>(CATEGORY_REPOSITORY);
    commentRepository = module.get<ICommentRepository>(COMMENT_REPOSITORY);
    userRepository = module.get<IUserRepository>(USER_REPOSITORY);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await cleanupDatabase(prisma);
  });

  describe('존재하지 않는 게시글을 조회하는 경우', () => {
    it('예외가 발생한다', async () => {
      await expect(sut.execute({ articleId: 'articleId', userRole: userRoles.admin.name })).rejects.toThrow(
        ArticleNotFoundException,
      );
    });
  });

  describe('비공개 게시글을', () => {
    const category = createCategory();
    const article = createArticle({ category, visible: false });

    describe('일반 유저가 조회하는 경우', () => {
      it('예외가 발생한다', async () => {
        await categoryRepository.save(category);
        await articleRepository.save(article);

        await expect(sut.execute({ articleId: 'articleId', userRole: userRoles.normal.name })).rejects.toThrow(
          ArticleNotFoundException,
        );
      });
    });
  });

  describe('댓글이 작성되어있는', () => {
    const category = createCategory();
    const article = createArticle({ category });
    const author = createUser();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const comments = Array.from({ length: 3 }, (_, i) =>
      createComment({ author, articleId: article.getId().toString() }),
    );

    describe('게시글을 조회하면', () => {
      it('댓글이 포함된 게시글 상세정보를 반환한다', async () => {
        await userRepository.save(author);
        await categoryRepository.save(category);
        await articleRepository.save(article);
        await commentRepository.saveMany(comments);

        const result = await sut.execute({ articleId: article.getId().toString(), userRole: userRoles.admin.name });
        expect(result.getComments()).toHaveLength(comments.length);
        expect(result.getComments()[0].getAuthorId()).toBe(author.getId());
        expect(result.getTitle()).toBe(article.getTitle());
        expect(result.getContent()).toBe(article.getContent());
      });
    });
  });
});
