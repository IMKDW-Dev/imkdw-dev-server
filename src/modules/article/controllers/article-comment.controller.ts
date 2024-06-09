import { Body, Controller, Param, Post } from '@nestjs/common';
import Requester from '../../../common/decorators/requester.decorator';
import { IRequester } from '../../../common/types/common.type';
import RequestCreateCommentDto from '../dto/request/article-comment/create-comment.dto';
import * as Swagger from '../docs/article-comment.swagger';
import ArticleCommentService from '../services/article-comment/article-comment.service';

@Controller({ path: 'articles/:articleId/comments', version: '1' })
export default class ArticleCommentController {
  constructor(private readonly articleCommentService: ArticleCommentService) {}

  @Swagger.createComment('댓글 작성')
  @Post()
  async createComment(
    @Requester() requester: IRequester,
    @Param('articleId') articleId: string,
    @Body() dto: RequestCreateCommentDto,
  ) {
    return this.articleCommentService.createComment({ ...dto, articleId, userId: requester.userId });
  }
}
