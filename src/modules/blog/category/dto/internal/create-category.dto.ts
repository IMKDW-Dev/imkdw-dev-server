export interface CreateCategoryDto {
  name: string;
  desc: string;
  image: Express.Multer.File;
}
