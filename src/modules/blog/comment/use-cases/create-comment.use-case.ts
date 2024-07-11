import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../common/interfaces/use-case.interface';
import { CreateCommentDto } from '../dto/internal/create-comment.dto';
import Comment from '../domain/models/comment.model';
import { ARTICLE_REPOSITORY, IArticleRepository } from '../../article/repository/article-repo.interface';
import { ArticleNotFoundException, CommentNotFoundException } from '../../../../common/exceptions/404';
import { COMMENT_REPOSITORY } from '../repository/comment-repo.interface';
import CommentRepository from '../infra/comment.repository';
import UserService from '../../../user/services/user.service';

@Injectable()
export default class CreateCommentUseCase implements UseCase<CreateCommentDto, Comment> {
  constructor(
    @Inject(ARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository,
    @Inject(COMMENT_REPOSITORY) private readonly commentRepository: CommentRepository,
    private readonly userService: UserService,
  ) {}

  async execute(dto: CreateCommentDto): Promise<Comment> {
    await this.checkArticleExist(dto.articleId);

    const author = await this.userService.findOne({ id: dto.userId });
    const comment = new Comment.builder().setArticleId(dto.articleId).setContent(dto.content).setAuthor(author).build();

    if (dto.parentId) {
      const parentComment = await this.commentRepository.findOne({ id: dto.parentId });
      if (!parentComment) {
        throw new CommentNotFoundException(`댓글 아이디 ${dto.parentId}을 찾을 수 없습니다.`);
      }
      parentComment.checkReplyAvailable();
      comment.setParentId(parentComment.getId());
    }

    return this.commentRepository.save(comment);
  }

  private async checkArticleExist(articleId: string): Promise<void> {
    const article = await this.articleRepository.findOne({ articleId });
    if (!article) {
      throw new ArticleNotFoundException(`게시글 아이디 ${articleId}을 찾을 수 없습니다.`);
    }
  }
}
