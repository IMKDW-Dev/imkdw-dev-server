import ArticleDto from '../article.dto';

export interface CreateArticleDto extends Pick<ArticleDto, 'id' | 'categoryId' | 'content' | 'title' | 'visible'> {
  thumbnail: Express.Multer.File;
  tags: string[];
}
