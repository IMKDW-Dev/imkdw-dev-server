import Tag from '../../../tag/domain/entities/tag.entity';

export default class ArticleDetail {
  private id: string;
  private title: string;
  private content: string;
  private viewCount: number;
  private tags: Tag[];
  private comments: any[];
}
