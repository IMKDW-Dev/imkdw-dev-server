import { PickType } from '@nestjs/swagger';
import Category from '../../domain/entities/category.entity';

interface Props {
  id: number;
  name: string;
  image: string;
  desc: string;
  sort: number;
}

export default class ResponseCreateCategoryDto extends PickType(Category, ['id', 'name', 'image', 'desc', 'sort']) {
  static create(props: Props) {
    return new ResponseCreateCategoryDto(props);
  }
}
