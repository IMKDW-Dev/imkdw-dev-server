import { ApiProperty } from '@nestjs/swagger';
import Article from '../../../article/domain/entities/article.entity';
import Tag from '../../../tag/domain/entities/tag.entity';

interface Props {
  article: Article;
  tag: Tag;
}

export default class ArticleTag {
  constructor(props: Props) {
    this.article = props.article;
    this.tag = props.tag;
  }

  @ApiProperty({ description: '게시글' })
  article: Article;

  @ApiProperty({ description: '태그' })
  tag: Tag;

  static create(props: Props): ArticleTag {
    return new ArticleTag(props);
  }
}
