import CategoryDto from '../category.dto';

export interface UpdateCategoryDto extends Partial<Pick<CategoryDto, 'name' | 'sort' | 'image' | 'desc'>> {}
