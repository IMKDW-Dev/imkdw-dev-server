import { Inject, Injectable } from '@nestjs/common';
import {
  ARTICLE_COMMENT_REPOSITORY,
  IArticleCommentRepository,
} from '../../../repository/article-comment/article-comment-repo.interface';
import ArticleQueryService from '../article-query.service';
import { ArticleCommentNotFoundException, ArticleNotFoundException } from '../../../../../common/exceptions/404';
import { CannotReplyOnReplyCommentException } from '../../../../../common/exceptions/403';
import ArticleId from '../../../domain/value-objects/article-id.vo';
import ArticleCommentDto from '../../../dto/article-comment.dto';
import UserQueryService from '../../../../user/services/user-query.service';
import ArticleService from '../article.service';
import { CreateCommentDto } from '../../../dto/internal/article-comment/create-comment.dto';
import ArticleComment from '../../../domain/article-comment.entity';

@Injectable()
export default class ArticleCommentService {
  constructor(
    @Inject(ARTICLE_COMMENT_REPOSITORY) private readonly articleCommentRepository: IArticleCommentRepository,
    private readonly articleService: ArticleService,
    private readonly articleQueryService: ArticleQueryService,
    private readonly userQueryService: UserQueryService,
  ) {}

  async createComment(dto: CreateCommentDto): Promise<ArticleCommentDto> {
    const article = await this.articleQueryService.findOne({ id: new ArticleId(dto.articleId) });
    if (!article) {
      throw new ArticleNotFoundException(dto.articleId);
    }

    const user = await this.userQueryService.findOne({ id: dto.userId });

    if (dto.parentId) {
      const parentComment = await this.articleCommentRepository.findOne({ id: dto.parentId });
      if (!parentComment) {
        throw new ArticleCommentNotFoundException(dto.parentId);
      }

      // 답글에는 답글 작성이 불가능하다. 답글의 depth는 1로 제한
      if (parentComment.isParentComment()) {
        throw new CannotReplyOnReplyCommentException();
      }
    }

    const comment = ArticleComment.create({
      articleId: dto.articleId,
      parentId: dto.parentId,
      content: dto.content,
      author: user,
    });

    // TODO: 트랜잭션 처리
    const createdComment = await this.articleCommentRepository.save(comment);
    await this.articleService.addCommentCount(article);
    return createdComment;
  }
}
