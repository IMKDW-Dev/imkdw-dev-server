import { PartialType, PickType } from '@nestjs/swagger';
import CategoryDto from '../category.dto';

export default class RequestUpdateCategoryDto extends PartialType(PickType(CategoryDto, ['name', 'sort', 'desc'])) {}
