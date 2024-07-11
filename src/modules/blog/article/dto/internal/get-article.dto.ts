import { GetArticleSort } from '../../enums/article.enum';

export interface GetArticlesDto {
  userRole: string;
  sort: GetArticleSort;
  limit: number;
  page: number;
  categoryId?: number;
  excludeId?: string;
  search?: string;
}
