import { ApiProperty, PickType } from '@nestjs/swagger';
import ArticleDto from './article.dto';
import CategorySummaryDto from '../../category/dto/category-summary.dto';

export default class ArticleSummaryDto extends PickType(ArticleDto, [
  'id',
  'thumbnail',
  'title',
  'content',
  'viewCount',
  'createdAt',
]) {
  @ApiProperty({ description: '카테고리 정보', type: CategorySummaryDto })
  readonly category: CategorySummaryDto;
}
