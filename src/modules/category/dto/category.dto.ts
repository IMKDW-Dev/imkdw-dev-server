import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import IsCategoryName from '../decorators/validation/is-category-name.decorator';
import IsCategoryDesc from '../decorators/validation/is-category-desc.decorator';

export default class CategoryDto {
  constructor(id: number, name: string, image: string, desc: string, sort: number, articleCount: number) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.desc = desc;
    this.sort = sort;
    this.articleCount = articleCount;
  }

  @ApiProperty({ description: '카테고리 ID' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: '카테고리 이름' })
  @IsCategoryName()
  name: string;

  @ApiProperty({ description: '카테고리 이미지' })
  @IsString()
  image: string;

  @ApiProperty({ description: '카테고리 설명' })
  @IsCategoryDesc()
  desc: string;

  @ApiProperty({ description: '카테고리 정렬 순서' })
  @IsNumber()
  @Transform(({ value }) => +value)
  sort: number;

  @ApiProperty({ description: '카테고리 게시글 수' })
  @IsNumber()
  articleCount: number;
}
