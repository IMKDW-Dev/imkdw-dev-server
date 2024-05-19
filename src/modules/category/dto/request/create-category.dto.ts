import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export default class RequestCreateCategoryDto {
  @ApiProperty({ description: '카테고리 이름', maxLength: 20 })
  @IsString()
  @MaxLength(20)
  readonly name: string;
}
