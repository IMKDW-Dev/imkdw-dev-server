export interface UpdateArticleDto {
  articleId: string;
  title: string;
  visible: boolean;
  content: string;
  thumbnail?: Express.Multer.File;
  images?: string[];
  categoryId: number;
}
