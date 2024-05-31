import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import User from '../../../user/domain/entities/user.entity';

export default class ArticleComment {
  @ApiProperty({ description: '댓글 아이디', example: 1, type: Number })
  @IsNumber()
  @Type(() => Number)
  id: number;

  @ApiProperty({ description: '댓글 작성자', type: User })
  @Type(() => User)
  author: User;

  @ApiProperty({ description: '게시글 아이디', example: 'UUID' })
  @IsString()
  articleId: string;

  @ApiProperty({ description: '부모 댓글', type: ArticleComment, nullable: true })
  @Type(() => ArticleComment)
  parent: ArticleComment | null;

  @ApiProperty({ description: '댓글 내용', example: '댓글 내용' })
  @IsString()
  content: string;
}
