import { ApiProperty } from '@nestjs/swagger';
import CategoryDto from '../category.dto';

export default class ResponseGetCategoriesDto {
  @ApiProperty({ description: '카테고리 목록', type: [CategoryDto] })
  items: CategoryDto[];
}
