import Article from '../../../domain/entities/article.entity';

export interface CreateArticleDto extends Pick<Article, 'title' | 'visible'> {
  /**
   * 게시글 아이디
   */
  id: string;

  /**
   * 카테고리 ID
   */
  categoryId: number;

  content: string;

  /**
   * 썸네일 이미지
   */
  thumbnail: Express.Multer.File;

  /**
   * 태그 목록
   */
  tags: string[];

  images: string[];
}
