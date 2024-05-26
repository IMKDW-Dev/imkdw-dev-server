import ArticleDto from '../article.dto';

export interface UpdateArticleDto
  extends Partial<Pick<ArticleDto, 'title' | 'visible' | 'viewCount' | 'commentCount' | 'content' | 'thumbnail'>> {}
