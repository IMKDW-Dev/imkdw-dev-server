import { ApiProperty } from '@nestjs/swagger';
import CategoryDto from './category.dto';

export default class CategoryDetailDto extends CategoryDto {
  constructor(builder: CategoryDetailBuilder) {
    super();
    this.articleCount = builder.articleCount;
  }

  @ApiProperty({ description: '카테고리에 속한 게시글 수' })
  articleCount: number;
}

export class CategoryDetailBuilder extends CategoryDto {
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

  setArticleCount(articleCount: number): CategoryDetailBuilder {
    this.articleCount = articleCount;
    return this;
  }

  build(): CategoryDetailDto {
    return new CategoryDetailDto(this);
  }
}
