import Article from '../../../article/domain/entities/article.entity';
import Tag from '../../../tag/domain/models/tag.model';

export default class ArticleTag {
  constructor(article: Article, tag: Tag) {
    this.article = article;
    this.tag = tag;
  }

  private article: Article;
  private tag: Tag;

  // getArticleId() {
  //   return this.article.getId();
  // }

  getTagId() {
    return this.tag.getId();
  }

  static builder = class {
    article: Article;
    tag: Tag;

    setArticle(article: Article) {
      this.article = article;
      return this;
    }

    setTag(tag: Tag) {
      this.tag = tag;
      return this;
    }

    build() {
      return new ArticleTag(this.article, this.tag);
    }
  };
}
