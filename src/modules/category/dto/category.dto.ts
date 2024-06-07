import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

interface Props {
  id: number;
  name: string;
  image: string;
  desc: string;
  sort: number;
  articleCount: number;
}
export default class CategoryDto {
  constructor(props: Props) {
    this.id = props.id;
    this.name = props.name;
    this.image = props.image;
    this.desc = props.desc;
    this.sort = props.sort;
    this.articleCount = props.articleCount;
  }

  @ApiProperty({ description: '카테고리 ID' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: '카테고리 이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '카테고리 이미지' })
  @IsString()
  image: string;

  @ApiProperty({ description: '카테고리 설명' })
  @IsString()
  desc: string;

  @ApiProperty({ description: '카테고리 정렬 순서' })
  @IsNumber()
  @Type(() => Number)
  sort: number;

  @ApiProperty({ description: '카테고리 게시글 수' })
  @IsNumber()
  articleCount: number;

  static create(props: Props): CategoryDto {
    return new CategoryDto(props);
  }
}
