import Category from '../domain/models/category.model';
import CategoryDto from '../dto/category.dto';

// eslint-disable-next-line import/prefer-default-export
export const toDto = (category: Category): CategoryDto =>
  new CategoryDto(
    category.getId(),
    category.getName(),
    category.getImage(),
    category.getDesc(),
    category.getSort(),
    category.getArticleCount(),
  );
