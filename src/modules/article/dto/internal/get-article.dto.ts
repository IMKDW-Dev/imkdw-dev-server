import { GetArticleSort } from '../../enums/article.enum';

export interface GetArticlesDto {
  sort: GetArticleSort;
  limit: number;
  categoryId?: number;
  excludeId?: string;
  page: number;
  search?: string;
}
