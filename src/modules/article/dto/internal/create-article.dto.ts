import Article from '../../domain/entities/article.entity';

export interface CreateArticleDto extends Pick<Article, 'id' | 'content' | 'title' | 'visible'> {
  /**
   * 카테고리 ID
   */
  categoryId: number;

  /**
   * 썸네일 이미지
   */
  thumbnail: Express.Multer.File;

  /**
   * 태그 목록
   */
  tags: string[];
}
