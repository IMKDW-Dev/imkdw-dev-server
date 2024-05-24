import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import * as Swagger from '../docs/category.swagger';
import AdminGuard from '../../auth/guards/admin.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import UserRoles from '../../user/enums/user-role.enum';
import CategoryService from '../services/category.service';
import RequestCreateCategoryDto from '../dto/request/create-category.dto';
import { Public } from '../../auth/decorators/public.decorator';
import ResponseGetCategoriesDto from '../dto/response/get-categories.dto';
import CategoryDto from '../dto/category.dto';
import ResponseCreateCategoryDto from '../dto/response/create-category.dto';
import RequestUpdateCategoryDto from '../dto/request/update-category.dto';
import ResponseUpdateCategoryDto from '../dto/response/update-category.dto';

@Controller({ path: 'categories', version: '1' })
export default class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // TODO: 이미지 검증 파이프 추가하기
  @Swagger.createCategory('카테고리 생성')
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AdminGuard)
  @Roles(UserRoles.ADMIN)
  async createCategory(
    @Body() body: RequestCreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseCreateCategoryDto> {
    return this.categoryService.createCategory({ name: body.name, desc: body.desc, image: file });
  }

  @Swagger.getCategories('카테고리 목록 조회')
  @Public()
  @Get()
  async getCategories(
    @Query('limit', new DefaultValuePipe(999), ParseIntPipe) limit?: number,
  ): Promise<ResponseGetCategoriesDto> {
    const categories = await this.categoryService.getCategories(limit);
    return { items: categories };
  }

  @Swagger.getCategoryDetail('카테고리 상세 조회')
  @Public()
  @Get(':name')
  async getCategoryDetail(@Param('name') name: string): Promise<CategoryDto> {
    return this.categoryService.getCategoryDetail(name);
  }

  @Swagger.updateCategory('카테고리 수정')
  @UseGuards(AdminGuard)
  @Roles(UserRoles.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':categoryId')
  async updateCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() dto: RequestUpdateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseUpdateCategoryDto> {
    return this.categoryService.updateCategory(categoryId, dto, file);
  }
}
