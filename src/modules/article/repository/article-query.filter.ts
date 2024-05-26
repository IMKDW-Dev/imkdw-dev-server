import ArticleDto from '../dto/article.dto';

export interface ArticleQueryFilter extends Partial<Pick<ArticleDto, 'id' | 'categoryId'>> {}
