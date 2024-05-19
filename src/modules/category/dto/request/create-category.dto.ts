import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export default class RequestCreateCategoryDto {
  @ApiProperty({ description: '카테고리 이름', maxLength: 20 })
  @IsString()
  @MaxLength(20)
  readonly name: string;

  @ApiProperty({ description: '카테고리 설명', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  readonly desc: string;

  @ApiProperty({ description: '카테고리 이미지 파일', type: 'string', format: 'binary' })
  readonly image: Express.Multer.File;
}
