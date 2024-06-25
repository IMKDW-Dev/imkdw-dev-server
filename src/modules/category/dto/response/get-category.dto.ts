import { ApiProperty } from '@nestjs/swagger';
import CategoryDto from '../category.dto';

export default class ResponseGetCategoriesDto {
  constructor(categories: CategoryDto[]) {
    this.categories = categories;
  }

  @ApiProperty({ description: '카테고리 목록', type: [CategoryDto] })
  categories: CategoryDto[];
}
