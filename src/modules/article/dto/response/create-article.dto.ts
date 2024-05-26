import { PickType } from '@nestjs/swagger';
import ArticleDto from '../article.dto';

export default class ResponseCreateArticleDto extends PickType(ArticleDto, ['id']) {
  constructor(id: string) {
    super();
    this.id = id;
  }
}
