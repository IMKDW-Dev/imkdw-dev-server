import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, MaxLength } from 'class-validator';

const CATEGORY_NAME_MAX_LENGTH = 20;
const CATEOGRY_DESC_MAX_LENGTH = 255;

export default class CategoryDto {
  constructor(builder?: CategoryDtoBuilder) {
    this.id = builder.id;
    this.name = builder.name;
    this.image = builder.image;
    this.desc = builder.desc;
    this.sort = builder.sort;
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
}

export class CategoryDtoBuilder {
  id: number;
  name: string;
  image: string | null;
  desc: string;
  sort: number;

  setId(id: number): CategoryDtoBuilder {
    this.id = id;
    return this;
  }

  setName(name: string): CategoryDtoBuilder {
    this.name = name;
    return this;
  }

  setImage(image: string | null): CategoryDtoBuilder {
    this.image = image;
    return this;
  }

  setDesc(desc: string): CategoryDtoBuilder {
    this.desc = desc;
    return this;
  }

  setSort(sort: number): CategoryDtoBuilder {
    this.sort = sort;
    return this;
  }

  build(): CategoryDto {
    return new CategoryDto(this);
  }
}
