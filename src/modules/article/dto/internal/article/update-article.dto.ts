import Article from '../../../domain/entities/article.entity';

export interface UpdateArticleDto
  extends Pick<Article, 'title' | 'visible' | 'viewCount' | 'commentCount' | 'content' | 'thumbnail'> {}
