import Article from '../../../article/domain/entities/article.entity';
import Tag from '../../../tag/domain/entities/tag.entity';
import ArticleTag from '../../domain/entities/article-tag.entity';

// eslint-disable-next-line import/prefer-default-export
export const generateArticleTags = (article: Article, tags: Tag[]) =>
  tags.map((tag) => ArticleTag.create({ article, tag }));
