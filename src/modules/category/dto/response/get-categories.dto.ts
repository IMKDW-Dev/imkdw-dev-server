import { ApiProperty } from '@nestjs/swagger';
import Category from '../../domain/entities/category.entity';

export class GetCategoriesItem {
  @ApiProperty({ description: '카테고리 아이디' })
  id: number;

  @ApiProperty({ description: '카테고리 이름' })
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  static toDto(category: Category): GetCategoriesItem {
    return new GetCategoriesItem(category.getId(), category.getName());
  }
}

export default class ResponseGetCategoriesDto {
  @ApiProperty({ description: '카테고리 목록', type: [GetCategoriesItem] })
  items: GetCategoriesItem[];
}
