import { QueryOption } from '../../../../common/interfaces/common-query.filter';
import Article from '../../domain/entities/article.entity';

export type ArticleQueryOption = QueryOption<Pick<Article, 'createdAt' | 'viewCount'>>;
