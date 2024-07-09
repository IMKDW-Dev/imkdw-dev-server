export interface UpdateArticleDto {
  title?: string;
  visible?: boolean;
  viewCount?: number;
  commentCount?: number;
  thumbnail?: Express.Multer.File;
  categoryId?: number;
  content?: string;
  images?: string[];
}
