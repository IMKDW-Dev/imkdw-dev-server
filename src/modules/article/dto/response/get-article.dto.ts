import { ApiProperty } from '@nestjs/swagger';

import ResponseOffsetPagingDto from '../../../../common/dto/response/offset-paging.dto';
import ArticleDto from '../article.dto';
import { OffsetPagingResult } from '../../../../common/functions/offset-paging.function';

interface Props extends OffsetPagingResult<ArticleDto> {}

export default class ResponseGetArticlesDto extends ResponseOffsetPagingDto {
  constructor(props: Props) {
    super();
    this.items = props.items;
    this.totalPage = props.totalPage;
    this.hasNextPage = props.hasNextPage;
    this.hasPreviousPage = props.hasPreviousPage;
  }

  @ApiProperty({ description: '데이터 목록', type: [ArticleDto] })
  items: ArticleDto[];

  static create(props: Props): ResponseGetArticlesDto {
    return new ResponseGetArticlesDto(props);
  }
}
