import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import ArticleService from '../services/article.service';
import * as Swagger from '../docs/article.swagger';
import AdminGuard from '../../auth/guards/admin.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import UserRoles from '../../user/enums/user-role.enum';
import RequestCreateArticleDto from '../dto/request/create-article.dto';

@ApiTags('게시글')
@Controller({ path: 'articles', version: '1' })
export default class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Swagger.createArticle('게시글 생성')
  @UseInterceptors(FileInterceptor('thumbnail'))
  @UseGuards(AdminGuard)
  @Roles(UserRoles.ADMIN)
  @Post()
  async createArticle(@Body() dto: RequestCreateArticleDto, @UploadedFile() file: Express.Multer.File) {
    return this.articleService.createArticle(dto, file);
  }
}
