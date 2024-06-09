import ArticleStatsDto from '../../dto/article-stats.dto';

interface Props extends Partial<ArticleStats> {}

export default class ArticleStats {
  constructor(props: Props) {
    this.totalArticles = props.totalArticles;
    this.totalComments = props.totalComments;
    this.totalViews = props.totalViews;
  }

  totalArticles: number;
  totalComments: number;
  totalViews: number;

  toDto(): ArticleStatsDto {
    return ArticleStatsDto.create({
      totalArticles: this.totalArticles,
      totalComments: this.totalComments,
      totalViews: this.totalViews,
    });
  }

  static create(props: Props): ArticleStats {
    return new ArticleStats(props);
  }
}
