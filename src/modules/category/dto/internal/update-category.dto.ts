export interface UpdateCategoryDto {
  categoryId: number;
  name: string;
  sort: number;
  desc: string;
  image?: Express.Multer.File;
}
