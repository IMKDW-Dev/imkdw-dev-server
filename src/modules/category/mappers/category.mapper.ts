import Category from '../domain/entities/category.entity';
import CategoryDto from '../dto/category.dto';

// eslint-disable-next-line import/prefer-default-export
export const toDto = (category: Category): CategoryDto =>
  CategoryDto.create({
    id: category.id,
    name: category.name,
    image: category.image,
    desc: category.desc,
    sort: category.sort,
    articleCount: category.articleCount,
  });
