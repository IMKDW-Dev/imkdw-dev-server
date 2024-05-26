import { Inject, Injectable } from '@nestjs/common';
import { ARTICLE_REPOSITORY, IArticleRepository } from '../repository/article-repo.interface';
import { ArticleQueryFilter } from '../repository/article-query.filter';
import Article from '../domain/entities/article.entity';

@Injectable()
export default class ArticleQueryService {
  constructor(@Inject(ARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository) {}

  async findOne(filter: ArticleQueryFilter): Promise<Article> {
    return this.articleRepository.findOne(filter);
  }
}
