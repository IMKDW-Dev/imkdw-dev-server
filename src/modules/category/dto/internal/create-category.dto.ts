export interface CreateCategoryDto {
  name: string;
  image: Express.Multer.File;
  desc: string;
}
