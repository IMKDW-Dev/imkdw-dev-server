import { PickType } from '@nestjs/swagger';
import CategoryDto from './category.dto';

export default class CategorySummaryDto extends PickType(CategoryDto, ['id', 'name']) {
  constructor(id: number, name: string) {
    super();
    this.id = id;
    this.name = name;
  }
}
