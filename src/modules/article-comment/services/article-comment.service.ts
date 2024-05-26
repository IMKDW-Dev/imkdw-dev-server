import { Inject, Injectable } from '@nestjs/common';
import { ARTICLE_COMMENT_REPOSITORY, IArticleCommentRepository } from '../repository/article-comment-repo.interface';
import { CreateCommentDto } from '../dto/internal/create-comment.dto';
import ArticleQueryService from '../../article/services/article-query.service';
import { ArticleCommentNotFoundException, ArticleNotFoundException } from '../../../common/exceptions/404';
import { CannotReplyOnReplyCommentException } from '../../../common/exceptions/403';
import { ArticleCommentBuilder } from '../domain/entities/article-comment.entity';
import ArticleCommentDetailDto from '../dto/article-comment-detail.dto';
import ArticleService from '../../article/services/article.service';

@Injectable()
export default class ArticleCommentService {
  constructor(
    @Inject(ARTICLE_COMMENT_REPOSITORY) private readonly articleCommentRepository: IArticleCommentRepository,
    private readonly articleQueryService: ArticleQueryService,
    private readonly articleService: ArticleService,
  ) {}

  async createComment(dto: CreateCommentDto): Promise<ArticleCommentDetailDto> {
    const article = await this.articleQueryService.findOne({ id: dto.articleId });
    if (!article) {
      throw new ArticleNotFoundException(dto.articleId);
    }

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

    const comment = new ArticleCommentBuilder()
      .setArticleId(dto.articleId)
      .setParentId(dto.parentId)
      .setContent(dto.content)
      .setUserId(dto.userId)
      .build();

    // TODO: 트랜잭션 처리
    const createdComment = await this.articleCommentRepository.save(comment);
    await this.articleService.addCommentCount(article);
    return createdComment.toDto();
  }
}
