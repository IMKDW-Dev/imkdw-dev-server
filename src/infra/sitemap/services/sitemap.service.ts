import { Injectable } from '@nestjs/common';
import ArticleQueryService from '../../../modules/article/services/article/article-query.service';
import CategoryQueryService from '../../../modules/category/services/category-query.service';

@Injectable()
export default class SitemapService {
  constructor(
    private readonly articleQueryService: ArticleQueryService,
    private readonly categoryQueryService: CategoryQueryService,
  ) {}

  async getArticleIds(): Promise<string[]> {
    return this.articleQueryService.findIds({ includePrivate: false });
  }

  async getCategoryNames(): Promise<string[]> {
    return this.categoryQueryService.findNames({});
  }
}
