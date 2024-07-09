import { Injectable } from '@nestjs/common';
import CategoryService from '../../../modules/blog/category/services/category.service';
import ArticleService from '../../../modules/blog/article/services/article.service';

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
