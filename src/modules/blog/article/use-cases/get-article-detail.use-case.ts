import { Inject, Injectable } from '@nestjs/common';
import { GetArticleDetailDto } from '../dto/internal/get-article-detail.dto';
import Article from '../domain/models/article.model';
import { userRoles } from '../../../user/domain/models/user-role.model';
import { ARTICLE_REPOSITORY } from '../repository/article-repo.interface';
import ArticleRepository from '../infra/article.repository';
import { COMMENT_REPOSITORY, ICommentRepository } from '../../comment/repository/comment-repo.interface';
import { UseCase } from '../../../../common/interfaces/use-case.interface';
import { ArticleNotFoundException } from '../../../../common/exceptions/404';

@Injectable()
export default class GetArticleDetailUseCase implements UseCase<GetArticleDetailDto, Article> {
  constructor(
    @Inject(ARTICLE_REPOSITORY) private readonly articleRepository: ArticleRepository,
    @Inject(COMMENT_REPOSITORY) private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(dto: GetArticleDetailDto): Promise<Article> {
    const includePrivate = dto.userRole === userRoles.admin.name;
    const articleDetail = await this.articleRepository.findOne({ articleId: dto.articleId, includePrivate });
    if (!articleDetail) {
      throw new ArticleNotFoundException(`게시글 아이디 ${dto.articleId}을 찾을 수 없습니다.`);
    }

    const comments = await this.commentRepository.findMany({ articleId: articleDetail.getId().toString() });
    articleDetail.setComments(comments);

    return articleDetail;
  }
}
