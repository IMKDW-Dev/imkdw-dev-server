import { ApiProperty } from '@nestjs/swagger';

export default class ArticleStatsDto {
  constructor(totalArticles: number, totalComments: number, totalViews: number) {
    this.totalArticles = totalArticles;
    this.totalComments = totalComments;
    this.totalViews = totalViews;
  }

  @ApiProperty({ description: '총 게시글의 수', example: 100 })
  totalArticles: number;

  @ApiProperty({ description: '총 댓글의 수', example: 100 })
  totalComments: number;

  @ApiProperty({ description: '총 조회수', example: 100 })
  totalViews: number;
}
