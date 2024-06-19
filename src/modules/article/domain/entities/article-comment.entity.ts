import User from '../../../user/domain/entities/user.entity';

interface Props extends Partial<ArticleComment> {}

export default class ArticleComment {
  constructor(props: Props) {
    this.id = props.id;
    this.author = props.author;
    this.articleId = props.articleId;
    this.parentId = props.parentId;
    this.content = props.content;
    this.replies = props.replies ?? [];
    this.createdAt = props.createdAt;
  }

  id: number;
  author: User;
  articleId: string;
  parentId: number | null;
  content: string;
  createdAt: Date;
  replies: ArticleComment[];

  isParentComment() {
    return !!this.parentId;
  }

  static create(props: Props): ArticleComment {
    return new ArticleComment(props);
  }
}
