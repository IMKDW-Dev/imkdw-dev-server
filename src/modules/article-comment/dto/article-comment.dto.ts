import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsString, MaxLength } from 'class-validator';

export default class ArticleCommentDto {
  @ApiProperty({ description: '댓글 아이디' })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id: number;

  @ApiProperty({ description: '댓글 내용', maxLength: 1000 })
  @MaxLength(1000)
  @IsString()
  content: string;
}
