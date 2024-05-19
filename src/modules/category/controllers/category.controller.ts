import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import * as Swagger from '../docs/category.swagger';
import AdminGuard from '../../auth/guards/admin.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import UserRoles from '../../user/enums/user-role.enum';
import CategoryService from '../services/category.service';
import RequestCreateCategoryDto from '../dto/request/create-category.dto';

@Controller({ path: 'categories', version: '1' })
export default class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Swagger.createCategory('카테고리 생성')
  @Post()
  @UseGuards(AdminGuard)
  @Roles(UserRoles.ADMIN)
  async createCategory(@Body() body: RequestCreateCategoryDto): Promise<void> {
    await this.categoryService.createCategory(body.name);
  }
}
