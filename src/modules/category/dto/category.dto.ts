import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MaxLength } from 'class-validator';

export default class CategoryDto {
  @ApiProperty({ description: '카테고리 아이디', example: 1 })
  @IsNumber()
  readonly id: number;

  @ApiProperty({ description: '카테고리 이름', maxLength: 20, example: '카테고리1' })
  @IsString()
  @MaxLength(20)
  readonly name: string;

  @ApiProperty({ description: '카테고리 정렬 순서', example: 1 })
  @IsNumber()
  readonly sort: number;

  @ApiProperty({ description: '카테고리 설명', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  readonly desc: string;

  @ApiProperty({ description: '카테고리 이미지 파일', type: 'string', format: 'binary' })
  readonly image: string;

  @ApiProperty({ description: '카테고리에 속한 게시글 개수' })
  @IsNumber()
  readonly articleCount: number;

  constructor(id: number, name: string, sort: number, desc: string, image: string, articleCount: number) {
    this.id = id;
    this.name = name;
    this.sort = sort;
    this.desc = desc;
    this.image = image;
    this.articleCount = articleCount;
  }
}
