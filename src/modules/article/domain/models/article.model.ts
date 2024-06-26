import Category from '../../../category/domain/models/category.model';
import Tag from '../../../tag/domain/models/tag.model';
import ArticleContent from '../vo/article-content.vo';
import ArticleId from '../vo/article-id.vo';
import ArticleComment from './article-comment.model';

export default class Article {
  constructor(
    id: ArticleId,
    title: string,
    category: Category,
    content: ArticleContent,
    visible: boolean,
    thumbnail: string,
    viewCount: number,
    createdAt: Date,
    tags: Tag[],
  ) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.content = content;
    this.visible = visible;
    this.thumbnail = thumbnail;
    this.viewCount = viewCount;
    this.createdAt = createdAt;
    this.tags = tags;
    this.comments = [];
  }

  private id: ArticleId;
  private title: string;
  private category: Category;
  private content: ArticleContent;
  private visible: boolean;
  private thumbnail: string;
  private viewCount: number;
  private createdAt: Date;
  private tags: Tag[];
  private comments: ArticleComment[];

  /**
   * GETTER
   */
  getId() {
    return this.id.toString();
  }

  getTitle() {
    return this.title;
  }

  getContent() {
    return this.content.toString();
  }

  getVisible() {
    return this.visible;
  }

  getThumbnail() {
    return this.thumbnail;
  }

  getViewCount() {
    return this.viewCount;
  }

  getCategoryId() {
    return this.category.getId();
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getTags() {
    return this.tags;
  }

  getComments() {
    return this.comments;
  }

  getCategory() {
    return this.category;
  }

  /**
   * OTHERS
   */
  changeTitle(title: string) {
    this.title = title;
  }

  changeContent(content: ArticleContent) {
    this.content = content;
  }

  changeVisible(visible: boolean) {
    this.visible = visible;
  }

  addViewCount() {
    this.viewCount += 1;
  }

  changeThumbnail(thumbnail: string) {
    this.thumbnail = thumbnail;
  }

  changeCategory(category: Category) {
    this.category = category;
  }

  updateImageUrls(paths: { fromPath: string; toPath: string }[]) {
    this.content.updateImageUrls(paths);
  }

  setComments(comments: ArticleComment[]) {
    this.comments = comments;
  }

  static builder = class {
    id: ArticleId;
    title: string;
    category: Category;
    content: ArticleContent;
    visible: boolean;
    thumbnail: string;
    viewCount: number;
    createdAt: Date;
    tags: Tag[];

    setId(id: ArticleId): this {
      this.id = id;
      return this;
    }

    setTitle(title: string): this {
      this.title = title;
      return this;
    }

    setCategory(category: Category): this {
      this.category = category;
      return this;
    }

    setContent(content: ArticleContent): this {
      this.content = content;
      return this;
    }

    setVisible(visible: boolean): this {
      this.visible = visible;
      return this;
    }

    setThumbnail(thumbnail: string): this {
      this.thumbnail = thumbnail;
      return this;
    }

    setViewCount(viewCount: number): this {
      this.viewCount = viewCount;
      return this;
    }

    setCreatedAt(createdAt: Date): this {
      this.createdAt = createdAt;
      return this;
    }

    setTags(tags: Tag[]): this {
      this.tags = tags;
      return this;
    }

    build(): Article {
      return new Article(
        this.id,
        this.title,
        this.category,
        this.content,
        this.visible,
        this.thumbnail,
        this.viewCount,
        this.createdAt,
        this.tags,
      );
    }
  };
}
