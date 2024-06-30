import { Inject } from '@nestjs/common';
import ArticleStatsDto from '../../dto/article-stats.dto';
import { ARTICLE_REPOSITORY, IArticleRepository } from '../../repository/article/article-repo.interface';
import {
  ARTICLE_COMMENT_REPOSITORY,
  IArticleCommentRepository,
} from '../../repository/article-comment/article-comment-repo.interface';

export default class ArticleStatsService {
  constructor(
    @Inject(ARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository,
    @Inject(ARTICLE_COMMENT_REPOSITORY) private readonly articleCommentRepository: IArticleCommentRepository,
  ) {}

  async getArticleStats(): Promise<ArticleStatsDto> {
    const articles = await this.articleRepository.findMany({ includePrivate: false });
    const comments = await this.articleCommentRepository.findMany({});
    const articleViews = articles.reduce((acc, article) => acc + article.getViewCount(), 0);
    return new ArticleStatsDto(articles.length, comments.length, articleViews);
  }
}
