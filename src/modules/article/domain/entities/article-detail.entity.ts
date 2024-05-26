import ArticleCommentDetail from '../../../article-comment/domain/entities/article-comment-detail.entity';
import Tag from '../../../tag/domain/entities/tag.entity';
import ArticleDetailDto from '../../dto/article-detail.dto';

export default class ArticleDetail {
  constructor(builder: ArticleDetailBuilder) {
    this.id = builder.id;
    this.title = builder.title;
    this.content = builder.content;
    this.viewCount = builder.viewCount;
    this.tags = builder.tags;
    this.createdAt = builder.createdAt;
    this.comments = builder.comments;
  }

  private id: string;
  private title: string;
  private content: string;
  private viewCount: number;
  private tags: Tag[];
  private comments: ArticleCommentDetail[];
  private createdAt: Date;
  private thumbnail: string;

  toDto(): ArticleDetailDto {
    return new ArticleDetailDto(
      this.id,
      this.title,
      this.content,
      this.tags.map((tag) => tag.toDto()),
      this.comments,
      this.createdAt,
      this.thumbnail,
    );
  }
}

export class ArticleDetailBuilder {
  id: string;
  title: string;
  content: string;
  viewCount: number;
  tags: Tag[];
  comments: ArticleCommentDetail[];
  createdAt: Date;
  thumbnail: string;

  setId(id: string): ArticleDetailBuilder {
    this.id = id;
    return this;
  }

  setTitle(title: string): ArticleDetailBuilder {
    this.title = title;
    return this;
  }

  setContent(content: string): ArticleDetailBuilder {
    this.content = content;
    return this;
  }

  setViewCount(viewCount: number): ArticleDetailBuilder {
    this.viewCount = viewCount;
    return this;
  }

  setTags(tags: Tag[]): ArticleDetailBuilder {
    this.tags = tags;
    return this;
  }

  setComments(comments: ArticleCommentDetail[]): ArticleDetailBuilder {
    this.comments = comments;
    return this;
  }

  setCreatedAt(createdAt: Date): ArticleDetailBuilder {
    this.createdAt = createdAt;
    return this;
  }

  setThumbnail(thumbnail: string): ArticleDetailBuilder {
    this.thumbnail = thumbnail;
    return this;
  }

  build(): ArticleDetail {
    return new ArticleDetail(this);
  }
}
