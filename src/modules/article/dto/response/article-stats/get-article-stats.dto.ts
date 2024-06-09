import { PickType } from '@nestjs/swagger';
import ArticleStatsDto from '../../article-stats.dto';

interface Props extends Partial<ArticleStatsDto> {}

export default class ResponseGetArticleStatsDto extends PickType(ArticleStatsDto, [
  'totalArticles',
  'totalComments',
  'totalViews',
]) {
  constructor(props: Props) {
    super();
    this.totalArticles = props.totalArticles;
    this.totalComments = props.totalComments;
    this.totalViews = props.totalViews;
  }

  static create(props: ResponseGetArticleStatsDto): ResponseGetArticleStatsDto {
    return new ResponseGetArticleStatsDto(props);
  }
}
