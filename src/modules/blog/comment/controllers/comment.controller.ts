import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as Swagger from '../docs/comment.swagger';
import CommentService from '../services/comment.service';
import RequestCreateCommentDto from '../dto/request/create-comment.dto';
import Requester from '../../../../common/decorators/requester.decorator';
import { IRequester } from '../../../../common/types/common.type';

@ApiTags('[게시글] 댓글')
@Controller({ path: 'articles/:articleId/comments', version: '1' })
export default class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Swagger.createComment('댓글 작성')
  @Post()
  async createComment(
    @Requester() requester: IRequester,
    @Param('articleId') articleId: string,
    @Body() dto: RequestCreateCommentDto,
  ) {
    return this.commentService.createComment({ ...dto, articleId, userId: requester.userId });
  }
}
