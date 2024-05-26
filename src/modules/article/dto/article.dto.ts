import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsString, MaxLength } from 'class-validator';

export default class ArticleDto {
  @ApiProperty({ description: '게시글 아이디', maxLength: 231 })
  @IsString()
  @MaxLength(231)
  id: string;

  @ApiProperty({ description: '게시글 제목', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: '게시글 카테고리 아이디' })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  categoryId: number;

  @ApiProperty({ description: '게시글 작성자 아이디', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  author: string;

  @ApiProperty({ description: '게시글 내용', maxLength: 65000 })
  @IsString()
  @MaxLength(65000)
  content: string;

  @ApiProperty({ description: '게시글 공개 여부' })
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  visible: boolean;

  @ApiProperty({ description: '게시글 썸네일' })
  @IsString()
  thumbnail: string;

  @ApiProperty({ description: '게시글 조회수' })
  @IsNumber()
  viewCount: number;

  @ApiProperty({ description: '게시글 댓글 수' })
  @IsNumber()
  commentCount: number;
}
