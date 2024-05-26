import { GetArticleFilter } from '../../enums/article.enum';

export interface GetArticlesDto {
  filter: GetArticleFilter;
  limit: number;
}
