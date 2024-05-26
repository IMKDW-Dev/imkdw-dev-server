import Article from '../../../article/domain/entities/article.entity';
import Tag from '../../../tag/domain/entities/tag.entity';

export default class ArticleTag {
  constructor(builder: ArticleTagBuilder) {
    this.id = builder.id;
    this.article = builder.article;
    this.tag = builder.tag;
  }

  private id: number;
  private article: Article;
  private tag: Tag;

  getId(): number {
    return this.id;
  }

  getArticle(): Article {
    return this.article;
  }

  getTag(): Tag {
    return this.tag;
  }
}

export class ArticleTagBuilder {
  id: number;
  article: Article;
  tag: Tag;

  setId(id: number): ArticleTagBuilder {
    this.id = id;
    return this;
  }

  setArticle(article: Article): ArticleTagBuilder {
    this.article = article;
    return this;
  }

  setTag(tag: Tag): ArticleTagBuilder {
    this.tag = tag;
    return this;
  }

  build(): ArticleTag {
    return new ArticleTag(this);
  }
}
