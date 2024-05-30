import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

const CATEGORY_NAME_MAX_LENGTH = 20;
const CATEOGRY_DESC_MAX_LENGTH = 255;

export default class CategoryDetailDto {
  constructor(builder: CategoryDetailBuilder) {
    this.id = builder.id;
    this.name = builder.name;
    this.desc = builder.desc;
    this.image = builder.image;
    this.sort = builder.sort;
    this.articleCount = builder.articleCount;
  }

  @ApiProperty({ description: '카테고리 아이디', example: 1 })
  @IsNumber()
  @Type(() => Number)
  id: number;

  @ApiProperty({ description: '카테고리 이름', example: 'backend', maxLength: CATEGORY_NAME_MAX_LENGTH })
  @IsString()
  @MaxLength(CATEGORY_NAME_MAX_LENGTH)
  name: string;

  @ApiProperty({ description: '카테고리 이미지 URL', example: 'https://example.com/image.jpg' })
  @IsString()
  image: string | null;

  @ApiProperty({
    description: '카테고리 설명',
    example: '백엔드 개발자를 위한 카테고리',
    maxLength: CATEOGRY_DESC_MAX_LENGTH,
  })
  @IsString()
  @MaxLength(CATEOGRY_DESC_MAX_LENGTH)
  desc: string;

  @ApiProperty({ description: '카테고리 정렬 순서', example: 1 })
  @IsNumber()
  @Type(() => Number)
  sort: number;

  @ApiProperty({ description: '카테고리에 속한 게시글 수' })
  articleCount: number;
}

export class CategoryDetailBuilder {
  id: number;
  name: string;
  desc: string;
  image: string;
  sort: number;
  articleCount: number;

  setId(id: number): CategoryDetailBuilder {
    this.id = id;
    return this;
  }

  setName(name: string): CategoryDetailBuilder {
    this.name = name;
    return this;
  }

  setDesc(desc: string): CategoryDetailBuilder {
    this.desc = desc;
    return this;
  }

  setImage(image: string): CategoryDetailBuilder {
    this.image = image;
    return this;
  }

  setSort(sort: number): CategoryDetailBuilder {
    this.sort = sort;
    return this;
  }

  setArticleCount(articleCount: number): CategoryDetailBuilder {
    this.articleCount = articleCount;
    return this;
  }

  build(): CategoryDetailDto {
    return new CategoryDetailDto(this);
  }
}
