import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
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
import { ApiTags } from '@nestjs/swagger';

import * as Swagger from '../docs/category.swagger';
import AdminGuard from '../../auth/guards/admin.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import CategoryService from '../services/category.service';
import RequestCreateCategoryDto from '../dto/request/create-category.dto';
import { Public } from '../../auth/decorators/public.decorator';
import RequestUpdateCategoryDto from '../dto/request/update-category.dto';
import CategoryDto from '../dto/category.dto';
import ResponseGetCategoriesDto from '../dto/response/get-category.dto';
import { userRoles } from '../../user/domain/models/user-role.model';

@ApiTags('카테고리')
@Controller({ path: 'categories', version: '1' })
export default class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // TODO: 이미지 검증 파이프 추가하기
  @Swagger.createCategory('카테고리 생성')
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AdminGuard)
  @Roles(userRoles.admin.name)
  async createCategory(
    @Body() dto: RequestCreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CategoryDto> {
    return this.categoryService.createCategory({ name: dto.name, desc: dto.desc, image: file });
  }

  @Swagger.getCategories('카테고리 목록 조회')
  @Public()
  @Get()
  async getCategories(
    @Query('limit', new DefaultValuePipe(999), ParseIntPipe) limit?: number,
  ): Promise<ResponseGetCategoriesDto> {
    const categories = await this.categoryService.getCategories(limit);
    return new ResponseGetCategoriesDto(categories);
  }

  @Swagger.getCategory('카테고리 상세 조회')
  @Public()
  @Get(':name')
  async getCategory(@Param('name') name: string): Promise<CategoryDto> {
    return this.categoryService.getCategory(name);
  }

  // TODO: 이미지 검증 파이프 추가하기
  @Swagger.updateCategory('카테고리 수정')
  @UseGuards(AdminGuard)
  @Roles(userRoles.admin.name)
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':categoryId')
  async updateCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() dto: RequestUpdateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CategoryDto> {
    return this.categoryService.updateCategory(categoryId, { ...dto, image: file });
  }

  @Swagger.deleteCategory('카테고리 삭제')
  @UseGuards(AdminGuard)
  @Roles(userRoles.admin.name)
  @Delete(':categoryId')
  async deleteCategory(@Param('categoryId', ParseIntPipe) categoryId: number): Promise<void> {
    await this.categoryService.deleteCategory(categoryId);
  }
}
