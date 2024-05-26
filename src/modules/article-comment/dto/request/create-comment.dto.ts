import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import ArticleCommentDto from '../article-comment.dto';

export default class RequestCreateCommentDto extends PickType(ArticleCommentDto, ['content']) {
  @ApiProperty({
    description: '답글 작성시 부모댓글의 아이디, 일반 댓글의 경우 null로 전달',
    nullable: true,
    default: null,
  })
  @IsOptional()
  @IsNumber()
  parentId: number = null;
}
