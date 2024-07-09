import {
  Body,
  Controller,
  Delete,
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
import RequestCreateArticleDto from '../dto/request/create-article.dto';
import GetArticlesQuery from '../dto/request/get-article.dto';
import ArticleDto from '../dto/article.dto';
import ResponseGetArticlesDto from '../dto/response/get-article.dto';
import RequestUpdateArticleDto from '../dto/request/update-article.dto';
import AdminGuard from '../../../auth/guards/admin.guard';
import { userRoles } from '../../../user/domain/models/user-role.model';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { Public } from '../../../auth/decorators/public.decorator';
import Requester from '../../../../common/decorators/requester.decorator';
import { IRequester } from '../../../../common/types/common.type';

@ApiTags('게시글')
@Controller({ path: 'articles', version: '1' })
export default class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Swagger.createArticle('게시글 생성')
  @UseInterceptors(FileInterceptor('thumbnail'))
  @UseGuards(AdminGuard)
  @Roles(userRoles.admin.name)
  @Post()
  async createArticle(
    @Body() dto: RequestCreateArticleDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ArticleDto> {
    return this.articleService.createArticle({ ...dto, thumbnail: file });
  }

  @Swagger.getArticleDetail('게시글 상세정보 조회')
  @Public()
  @Get(':articleId')
  async getArticleDetail(
    @Requester() requester: IRequester,
    @Param('articleId') articleId: string,
  ): Promise<ArticleDto> {
    return this.articleService.getArticleDetail(articleId, requester?.role);
  }

  @Swagger.getArticles('게시글 목록 조회')
  @Public()
  @Get()
  async getArticles(
    @Requester() requester: IRequester,
    @Query() query: GetArticlesQuery,
  ): Promise<ResponseGetArticlesDto> {
    return this.articleService.getArticles(query, requester?.role);
  }

  @Swagger.addViewCount('게시글 조회수 증가')
  @Public()
  @Patch(':articleId/view')
  async addViewCount(@Param('articleId') articleId: string, @Requester() requester: IRequester) {
    return this.articleService.addViewCount(articleId, requester?.role);
  }

  @Swagger.deleteArticle('게시글 삭제')
  @UseGuards(AdminGuard)
  @Roles(userRoles.admin.name)
  @Delete(':articleId')
  async deleteArticle(@Param('articleId') articleId: string) {
    return this.articleService.deleteArticle(articleId);
  }

  @Swagger.updateArticle('게시글 수정')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  @Roles(userRoles.admin.name)
  @Patch(':articleId')
  async updateArticle(
    @Param('articleId') articleId: string,
    @Body() dto: RequestUpdateArticleDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ArticleDto> {
    return this.articleService.updateArticle(articleId, { ...dto, thumbnail: file });
  }
}
