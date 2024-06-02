import Article from '../domain/entities/article.entity';

export interface ArticleQueryFilter extends Partial<Pick<Article, 'id' | 'category'>> {}
