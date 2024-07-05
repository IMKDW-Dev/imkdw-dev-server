import { PrismaClient } from '@prisma/client';
import { cleanupDatabase } from '../../../../../prisma/__test__/utils/cleanup';
import IntegrationTestModule from '../../../../__test__/modules/integration-test.module';
import { generateUUID } from '../../../../common/utils/uuid';
import PrismaService from '../../../../infra/database/prisma.service';
import { createCategory } from '../../../category/__test__/fixtures/create-category.fixture';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../../../category/repository/category-repo.interface';
import { createUser } from '../../../user/__test__/fixtures/create-user.fixture';
import { userRoles } from '../../../user/domain/models/user-role.model';
import { IUserRepository, USER_REPOSITORY } from '../../../user/repository/user/user-repo.interface';
import {
  ARTICLE_COMMENT_REPOSITORY,
  IArticleCommentRepository,
} from '../../repository/article-comment/article-comment-repo.interface';
import { ARTICLE_REPOSITORY, IArticleRepository } from '../../repository/article/article-repo.interface';
import ArticleService from '../../services/article/article.service';
import { createComment } from '../fixtures/article-comments/article-comment.fixture';
import { createArticle } from '../fixtures/article/article.fixture';

describe('ArticleIntegration', () => {
  let articleService: ArticleService;

  let categoryRepository: ICategoryRepository;
  let articleRepository: IArticleRepository;
  let articleCommentRepository: IArticleCommentRepository;
  let userRepository: IUserRepository;

  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await IntegrationTestModule.create();
    articleService = module.get<ArticleService>(ArticleService);

    categoryRepository = module.get<ICategoryRepository>(CATEGORY_REPOSITORY);
    articleRepository = module.get<IArticleRepository>(ARTICLE_REPOSITORY);
    articleCommentRepository = module.get<IArticleCommentRepository>(ARTICLE_COMMENT_REPOSITORY);
    userRepository = module.get<IUserRepository>(USER_REPOSITORY);

    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await cleanupDatabase(prisma);
  });

  describe('게시글 생성', () => {
    it.todo('게시글 생성 테스트');
  });

  describe('게시글 상세정보 조회', () => {
    it('게시글이 없는 경우 ArticleNotFoundException 에러가 발생한다', async () => {
      // Given
      const articleId = 'articleId';

      // When, Then
      await expect(articleService.getArticleDetail(articleId, userRoles.admin.name)).rejects.toThrow(Error);
    });

    it('게시글 상세정보에 댓글 목록이 빈 배열로 설정된다', async () => {
      // Given
      const categoryName = 'categoryName';
      const category = createCategory({ name: categoryName });
      await categoryRepository.save(category);

      const [articleId, title, content] = ['articleId', 'title', 'content'];
      const article = createArticle({ id: articleId, category, title, content });
      await articleRepository.save(article);

      // When
      const result = await articleService.getArticleDetail(articleId, userRoles.normal.name);

      // Then
      expect(result.title).toBe(title);
      expect(result.content).toBe(content);
      expect(result.comments).toEqual([]);
    });

    it('댓글이 있는 경우 게시글 상세정보에 댓글이 포함된다', async () => {
      // eslint-disable-next-line no-console
      console.log(await new PrismaClient().userOAuthProviders.findMany());
      // Given
      const user = createUser({ id: generateUUID() });
      await userRepository.save(user);

      const categoryName = 'categoryName';
      const category = createCategory({ name: categoryName });
      await categoryRepository.save(category);

      const [articleId, title, articleContent] = ['articleId', 'title', 'content'];
      const article = createArticle({ id: articleId, category, title, content: articleContent });
      await articleRepository.save(article);

      const [commentId, commentContent] = [1, 'comment'];
      const comment = createComment({ id: commentId, articleId, content: commentContent, author: user });
      await articleCommentRepository.save(comment);

      const [replyId, replyContent] = [2, 'reply'];
      const reply = createComment({ id: replyId, articleId, content: replyContent, parent: comment, author: user });
      await articleCommentRepository.save(reply);

      // When
      const result = await articleService.getArticleDetail(articleId, userRoles.normal.name);

      // Then
      expect(result.title).toBe(title);
      expect(result.content).toBe(articleContent);
      expect(result.comments).toHaveLength(1);
      expect(result.comments[0].content).toBe(commentContent);
      expect(result.comments[0].replies).toHaveLength(1);
      expect(result.comments[0].replies[0].content).toBe(replyContent);
    });
  });

  describe('게시글 수정', () => {
    it.todo('게시글 수정 테스트');
  });

  describe('게시글 삭제', () => {
    it.todo('게시글 삭제 테스트');
  });
});
