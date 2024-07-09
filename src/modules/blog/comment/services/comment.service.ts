import { Injectable } from '@nestjs/common';

import CommentDto from '../dto/comment.dto';
import * as ArticleCommentMapper from '../mappers/comment.mapper';
import { CreateCommentDto } from '../dto/internal/create-comment.dto';
import CreateCommentUseCase from '../use-cases/create-comment.use-case';

@Injectable()
export default class CommentService {
  constructor(private readonly createCommentUseCase: CreateCommentUseCase) {}

  async createComment(dto: CreateCommentDto): Promise<CommentDto> {
    const comment = await this.createCommentUseCase.execute(dto);
    return ArticleCommentMapper.toDto(comment);
  }
}
