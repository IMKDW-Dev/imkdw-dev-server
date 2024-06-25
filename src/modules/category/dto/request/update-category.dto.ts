import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import CategoryDto from '../category.dto';

export default class RequestUpdateCategoryDto extends PartialType(PickType(CategoryDto, ['name', 'sort', 'desc'])) {
  @ApiProperty({ description: '카테고리 이미지', type: 'string', format: 'binary' })
  @IsOptional()
  image: string;
}
