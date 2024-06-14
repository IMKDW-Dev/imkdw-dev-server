import Article from '../../../domain/entities/article.entity';

export interface UpdateArticleDto extends Partial<Pick<Article, 'title' | 'visible' | 'viewCount' | 'commentCount'>> {
  thumbnail?: Express.Multer.File;
  categoryId?: number;
  content?: string;
  images?: string[];
}
