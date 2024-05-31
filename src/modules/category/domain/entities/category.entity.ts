import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsUrl } from 'class-validator';
import IsCategoryName from '../../decorators/validation/is-category-name.decorator';
import IsCategoryDesc from '../../decorators/validation/is-category-desc.decorator';

interface Props {
  id?: number;
  name?: string;
  image?: string;
  desc?: string;
  sort?: number;
  articleCount?: number;
}

export default class Category {
  constructor(props: Props) {
    this.id = props.id;
    this.name = props.name;
    this.image = props.image;
    this.desc = props.desc;
    this.sort = props.sort;
    this.articleCount = props.articleCount;
  }

  @ApiProperty({ description: '카테고리 아이디', example: 1, type: Number })
  @IsNumber()
  @Type(() => Number)
  id: number;

  @ApiProperty({ description: '카테고리 이름', minLength: 2, maxLength: 20, example: '백엔드' })
  @IsCategoryName()
  name: string;

  @ApiProperty({ description: '카테고리 이미지 URL', example: 'https://example.com/image.jpg' })
  @IsUrl()
  image: string;

  @ApiProperty({ description: '카테고리 설명', example: '백엔드 개발자를 위한 카테고리' })
  @IsCategoryDesc()
  desc: string;

  @ApiProperty({ description: '카테고리 순서', example: 1, type: Number })
  @IsNumber()
  @Type(() => Number)
  sort: number;

  @ApiProperty({ description: '카테고리에 속한 게시글 개수', example: 10, type: Number })
  @IsNumber()
  @Type(() => Number)
  articleCount: number;

  static create(props: Props): Category {
    return new Category(props);
  }
}
