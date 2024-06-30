import { categories } from '@prisma/client';
import Category from '../domain/models/category.model';
import CategoryDto from '../dto/category.dto';

export const toDto = (category: Category): CategoryDto =>
  new CategoryDto(
    category.getId(),
    category.getName(),
    category.getImage(),
    category.getDesc(),
    category.getSort(),
    category.getArticleCount(),
  );

export const toModel = (category: categories) =>
  new Category.builder()
    .setId(category.id)
    .setName(category.name)
    .setImage(category.image)
    .setDesc(category.desc)
    .setSort(category.sort)
    .setArticleCount(category.articleCount)
    .build();
