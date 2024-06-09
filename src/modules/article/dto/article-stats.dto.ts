import { ApiProperty } from '@nestjs/swagger';

interface Props extends Partial<ArticleStatsDto> {}

export default class ArticleStatsDto {
  constructor(props: Props) {
    this.totalArticles = props.totalArticles;
    this.totalComments = props.totalComments;
    this.totalViews = props.totalViews;
  }

  @ApiProperty({ description: '총 게시글의 수', example: 100 })
  totalArticles: number;

  @ApiProperty({ description: '총 댓글의 수', example: 100 })
  totalComments: number;

  @ApiProperty({ description: '총 조회수', example: 100 })
  totalViews: number;

  static create(props: Props): ArticleStatsDto {
    return new ArticleStatsDto(props);
  }
}
