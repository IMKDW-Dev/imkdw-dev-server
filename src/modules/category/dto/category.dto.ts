import { PickType } from '@nestjs/swagger';
import Category from '../domain/entities/category.entity';

interface Props {
  id: number;
  name: string;
  image: string;
  desc: string;
  sort: number;
  articleCount: number;
}
export default class CategoryDto extends PickType(Category, ['id', 'name', 'image', 'desc', 'sort', 'articleCount']) {
  constructor(props: Props) {
    super();
    this.id = props.id;
    this.name = props.name;
    this.image = props.image;
    this.desc = props.desc;
    this.sort = props.sort;
    this.articleCount = props.articleCount;
  }

  static create(props: Props): CategoryDto {
    return new CategoryDto(props);
  }
}
