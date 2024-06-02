import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import ArticleService from '../services/article.service';
import * as Swagger from '../docs/article.swagger';
import AdminGuard from '../../auth/guards/admin.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import UserRoles from '../../user/enums/user-role.enum';
import RequestCreateArticleDto from '../dto/request/create-article.dto';
import { Public } from '../../auth/decorators/public.decorator';
import GetArticlesQuery from '../dto/request/get-article.dto';
import ResponseCreateArticleDto from '../dto/response/create-article.dto';
import ArticleDto from '../dto/article.dto';

@ApiTags('게시글')
@Controller({ path: 'articles', version: '1' })
export default class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Swagger.createArticle('게시글 생성')
  @UseInterceptors(FileInterceptor('thumbnail'))
  @UseGuards(AdminGuard)
  @Roles(UserRoles.ADMIN)
  @Post()
  async createArticle(
    @Body() dto: RequestCreateArticleDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseCreateArticleDto> {
    return this.articleService.createArticle(dto, file);
  }

  @Swagger.getArticleDetail('게시글 상세정보 조회')
  @Public()
  @Get(':articleId')
  async getArticleDetail(@Param('articleId') articleId: string): Promise<ArticleDto> {
    return this.articleService.getArticleDetail(articleId);
  }

  @Swagger.getArticles('게시글 목록 조회')
  @Public()
  @Get()
  async getArticles(@Query() query: GetArticlesQuery) {
    return this.articleService.getArticles(query);
  }

  @Swagger.addViewCount('게시글 조회수 증가')
  @Public()
  @Patch(':articleId/view')
  async addViewCount(@Param('articleId') articleId: string) {
    return this.articleService.addViewCount(articleId);
  }
}
