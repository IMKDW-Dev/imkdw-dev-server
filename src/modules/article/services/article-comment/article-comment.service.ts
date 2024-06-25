import { Inject, Injectable } from '@nestjs/common';

import { ArticleCommentNotFoundException, ArticleNotFoundException } from '../../../../common/exceptions/404';
import { CannotReplyOnReplyCommentException } from '../../../../common/exceptions/403';
import {
  ARTICLE_COMMENT_REPOSITORY,
  IArticleCommentRepository,
} from '../../repository/article-comment/article-comment-repo.interface';
import ArticleService from '../article/article.service';
import ArticleQueryService from '../article/article-query.service';
import ArticleCommentDto from '../../dto/article-comment.dto';
import { CreateCommentDto } from '../../dto/internal/article-comment/create-comment.dto';
import ArticleId from '../../domain/value-objects/article-id.vo';
import ArticleComment from '../../domain/entities/article-comment.entity';
import UserService from '../../../user/services/user.service';

@Injectable()
export default class ArticleCommentService {
  constructor(
    @Inject(ARTICLE_COMMENT_REPOSITORY) private readonly articleCommentRepository: IArticleCommentRepository,
    private readonly articleService: ArticleService,
    private readonly articleQueryService: ArticleQueryService,
    private readonly userQueryService: UserService,
  ) {}

  async createComment(dto: CreateCommentDto): Promise<ArticleCommentDto> {
    const article = await this.articleQueryService.findOne({ id: new ArticleId(dto.articleId) });
    if (!article) {
      throw new ArticleNotFoundException(`게시글을 찾을 수 없습니다. 게시글 ID: '${dto.articleId}`);
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
