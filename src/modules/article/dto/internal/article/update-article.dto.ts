import Article from '../../../domain/entities/article.entity';

export interface UpdateArticleDto
  extends Partial<Pick<Article, 'title' | 'visible' | 'viewCount' | 'commentCount' | 'content'>> {
  thumbnail?: Express.Multer.File;
}
