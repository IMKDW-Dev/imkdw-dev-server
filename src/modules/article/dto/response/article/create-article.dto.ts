import { ApiProperty } from '@nestjs/swagger';
import Article from '../../../domain/entities/article.entity';

export default class ResponseCreateArticleDto {
  constructor(id: string) {
    this.id = id;
  }

  @ApiProperty({ description: '생성된 게시글 아이디' })
  id: string;

  static create(article: Article) {
    return new ResponseCreateArticleDto(article.id.toString());
  }
}
