import { Inject, Injectable } from '@nestjs/common';

import { ArticleCommentNotFoundException } from '../../../../common/exceptions/404';
import {
  ARTICLE_COMMENT_REPOSITORY,
  IArticleCommentRepository,
} from '../../repository/article-comment/article-comment-repo.interface';
import ArticleService from '../article/article.service';
import ArticleCommentDto from '../../dto/article-comment.dto';
import { CreateCommentDto } from '../../dto/internal/article-comment/create-comment.dto';
import UserService from '../../../user/services/user.service';
import ArticleComment from '../../domain/models/article-comment.model';
import { ArticleCommentQueryFilter } from '../../repository/article-comment/article-comment-query.filter';
import * as ArticleCommentMapper from '../../mappers/article-comment.mapper';

@Injectable()
export default class ArticleCommentService {
  constructor(
    @Inject(ARTICLE_COMMENT_REPOSITORY) private readonly articleCommentRepository: IArticleCommentRepository,
    private readonly articleService: ArticleService,
    private readonly userQueryService: UserService,
  ) {}

  async createComment(dto: CreateCommentDto): Promise<ArticleCommentDto> {
    const article = await this.articleService.findOneOrThrow({ articleId: dto.articleId });
    const user = await this.userQueryService.findOne({ id: dto.userId });

    const comment = new ArticleComment.builder()
      .setArticleId(dto.articleId)
      .setContent(dto.content)
      .setAuthor(user)
      .build();

    if (dto.parentId) {
      const parentComment = await this.findOneOrThrow({ commentId: dto.parentId });
      comment.setParent(parentComment);
      comment.checkReplyAvailable();
    }

    const createdComment = await this.articleCommentRepository.save(comment);
    return ArticleCommentMapper.toDto(createdComment);
  }

  async findOneOrThrow(filter: ArticleCommentQueryFilter): Promise<ArticleComment> {
    const comment = await this.articleCommentRepository.findOne(filter);
    if (!comment) {
      throw new ArticleCommentNotFoundException(`댓글을 찾을 수 없습니다. filter: ${filter}`);
    }

    return comment;
  }
}
