import { PickType } from '@nestjs/swagger';
import CategoryDto from './category.dto';

export default class CategorySummaryDto extends PickType(CategoryDto, ['id', 'name']) {}
