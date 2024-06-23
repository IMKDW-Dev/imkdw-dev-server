import Article from '../../../domain/entities/article.entity';

export interface CreateArticleDto extends Pick<Article, 'title' | 'visible'> {
  id: string;
  categoryId: number;
  content: string;
  thumbnail: Express.Multer.File;
  tags: string[];
  images?: string[];
}
