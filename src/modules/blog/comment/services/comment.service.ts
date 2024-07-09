import { Inject, Injectable } from '@nestjs/common';

import { ArticleCommentNotFoundException } from '../../../../common/exceptions/404';
import CommentDto from '../dto/comment.dto';
import UserService from '../../../user/services/user.service';
import Comment from '../domain/models/comment.model';
import { ArticleCommentQueryFilter } from '../repository/comment-query.filter';
import * as ArticleCommentMapper from '../mappers/comment.mapper';
import { COMMENT_REPOSITORY, ICommentRepository } from '../repository/comment-repo.interface';
import ArticleService from '../../article/services/article.service';
import { CreateCommentDto } from '../dto/internal/create-comment.dto';

@Injectable()
export default class CommentService {
  constructor(
    @Inject(COMMENT_REPOSITORY) private readonly articleCommentRepository: ICommentRepository,
    private readonly articleService: ArticleService,
    private readonly userQueryService: UserService,
  ) {}

  async createComment(dto: CreateCommentDto): Promise<CommentDto> {
    await this.articleService.findOneOrThrow({ articleId: dto.articleId });
    const user = await this.userQueryService.findOne({ id: dto.userId });

    const comment = new Comment.builder().setArticleId(dto.articleId).setContent(dto.content).setAuthor(user).build();

    if (dto.parentId) {
      const parentComment = await this.findOneOrThrow({ id: dto.parentId });
      parentComment.checkReplyAvailable();
      comment.setParent(parentComment);
    }

    const createdComment = await this.articleCommentRepository.save(comment);
    return ArticleCommentMapper.toDto(createdComment);
  }

  async findOneOrThrow(filter: ArticleCommentQueryFilter): Promise<Comment> {
    const comment = await this.articleCommentRepository.findOne(filter);
    if (!comment) {
      throw new ArticleCommentNotFoundException(`댓글을 찾을 수 없습니다. filter: ${filter}`);
    }

    return comment;
  }
}
