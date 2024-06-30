export interface UpdateCategoryDto {
  name: string;
  sort: number;
  desc: string;
  image?: Express.Multer.File;
}
