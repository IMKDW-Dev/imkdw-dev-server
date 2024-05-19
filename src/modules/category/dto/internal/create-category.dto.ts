import CategoryDto from '../category.dto';

export interface CreateCategoryDto extends Pick<CategoryDto, 'name' | 'desc'> {
  image: Express.Multer.File;
}
