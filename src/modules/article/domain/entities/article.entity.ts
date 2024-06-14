import ArticleId from '../value-objects/article-id.vo';
import Category from '../../../category/domain/entities/category.entity';
import Tag from '../../../tag/domain/entities/tag.entity';
import ArticleComment from './article-comment.entity';
import ArticleContent from '../value-objects/article-content.vo';

interface Props extends Partial<Article> {}

export default class Article {
  constructor(props: Props) {
    this.id = props.id;
    this.title = props.title;
    this.category = props.category;
    this.content = props.content;
    this.visible = props.visible;
    this.thumbnail = props.thumbnail;
    this.viewCount = props.viewCount;
    this.commentCount = props.commentCount;
    this.createdAt = props.createdAt;
    this.tags = props.tags;
    this.comments = props.comments;
  }

  id: ArticleId;
  title: string;
  category: Category;
  content: ArticleContent;
  visible: boolean;
  thumbnail: string;
  viewCount: number;
  commentCount: number;
  createdAt: Date;
  tags: Tag[];
  comments: ArticleComment[];

  addCommentCount() {
    this.commentCount += 1;
  }

  addHashOnId() {
    this.id.addHash();
  }

  replaceContentImageUrl() {}

  addViewCount() {
    this.viewCount += 1;
  }

  changeTitle(title: string) {
    this.title = title;
  }

  changeVisible(visible: boolean) {
    this.visible = visible;
  }

  changeThumbnail(thumbnail: string) {
    this.thumbnail = thumbnail;
  }

  changeCategory(category: Category) {
    this.category = category;
  }

  changeContent(content: ArticleContent) {
    this.content = content;
  }

  static create(props: Props): Article {
    return new Article(props);
  }
}
