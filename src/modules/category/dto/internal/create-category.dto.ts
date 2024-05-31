import Category from '../../domain/entities/category.entity';

export interface CreateCategoryDto extends Pick<Category, 'name' | 'desc'> {
  image: Express.Multer.File;
}
