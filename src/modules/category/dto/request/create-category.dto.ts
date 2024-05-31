import { ApiProperty, PickType } from '@nestjs/swagger';
import Category from '../../domain/entities/category.entity';

export default class RequestCreateCategoryDto extends PickType(Category, ['name', 'desc']) {
  @ApiProperty({ description: '카테고리 이미지 파일', type: 'string', format: 'binary' })
  image: Express.Multer.File;
}
