import ArticleId from '../value-objects/article-id.vo';
import Category from '../../../category/domain/entities/category.entity';
import Tag from '../../../tag/domain/entities/tag.entity';
import ArticleComment from '../../../article-comment/domain/entities/article-comment.entity';

interface Props {
  id?: ArticleId;
  title?: string;
  category?: Category;
  content?: string;
  visible?: boolean;
  thumbnail?: string;
  viewCount?: number;
  commentCount?: number;
  createdAt?: Date;
  tags?: Tag[];
  comments?: ArticleComment[];
}

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
  content: string;
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

  addViewCount() {
    this.viewCount += 1;
  }

  static create(props: Props): Article {
    return new Article(props);
  }
}