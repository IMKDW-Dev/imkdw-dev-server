import { Injectable } from '@nestjs/common';
import ArticleService from '../../../modules/article/services/article/article.service';
import CategoryService from '../../../modules/category/services/category.service';

@Injectable()
export default class SitemapService {
  constructor(
    private readonly articleService: ArticleService,
    private readonly categoryService: CategoryService,
  ) {}

  async getArticleIds(): Promise<string[]> {
    return this.articleService.findIds({ includePrivate: false });
  }

  async getCategoryNames(): Promise<string[]> {
    return this.categoryService.findNames({});
  }
}
