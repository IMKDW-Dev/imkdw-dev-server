import Article from '../../../article/domain/entities/article.entity';
import Tag from '../../../tag/domain/entities/tag.entity';

interface Props extends Partial<ArticleTag> {}

export default class ArticleTag {
  constructor(props: Props) {
    this.article = props.article;
    this.tag = props.tag;
  }

  article: Article;
  tag: Tag;

  static create(props: Props): ArticleTag {
    return new ArticleTag(props);
  }
}
