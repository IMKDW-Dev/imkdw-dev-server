import { Inject } from '@nestjs/common';
import ArticleStatsDto from '../dto/article-stats.dto';
import { ARTICLE_REPOSITORY, IArticleRepository } from '../repository/article-repo.interface';
import { COMMENT_REPOSITORY, ICommentRepository } from '../../comment/repository/comment-repo.interface';

export default class ArticleStatsService {
  constructor(
    @Inject(ARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository,
    @Inject(COMMENT_REPOSITORY) private readonly commentRepository: ICommentRepository,
  ) {}

  async getArticleStats(): Promise<ArticleStatsDto> {
    const articles = await this.articleRepository.findMany({ includePrivate: false });
    const comments = await this.commentRepository.count();
    const articleViews = articles.reduce((acc, article) => acc + article.getViewCount(), 0);
    return new ArticleStatsDto(articles.length, comments, articleViews);
  }
}
