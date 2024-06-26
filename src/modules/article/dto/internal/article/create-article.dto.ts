export interface CreateArticleDto {
  title: string;
  visible: boolean;
  id: string;
  categoryId: number;
  content: string;
  thumbnail: Express.Multer.File;
  tags: string[];
  images?: string[];
}
