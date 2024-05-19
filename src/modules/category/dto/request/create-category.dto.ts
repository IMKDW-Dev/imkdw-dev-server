import { ApiProperty, PickType } from '@nestjs/swagger';
import CategoryDto from '../category.dto';

export default class RequestCreateCategoryDto extends PickType(CategoryDto, ['name', 'desc']) {
  @ApiProperty({ description: '카테고리 이미지 파일', type: 'string', format: 'binary' })
  image: Express.Multer.File;
}
