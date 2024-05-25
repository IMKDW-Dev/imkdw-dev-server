import { Inject, Injectable } from '@nestjs/common';
import { ARTICLE_REPOSITORY, IArticleRepository } from '../repository/article-repo.interface';

@Injectable()
export default class ArticleService {
  constructor(@Inject(ARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository) {}
}
