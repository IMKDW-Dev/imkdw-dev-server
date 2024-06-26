import ArticleDto from '../dto/article.dto';
import * as ArticleCommentMapper from './article-comment.mapper';
import * as CategoryMapper from '../../category/mappers/category.mapper';
import * as TagMapper from '../../tag/mappers/tag.mapper';
import Article from '../domain/models/article.model';

// eslint-disable-next-line import/prefer-default-export
export const toDto = (article: Article) =>
  ArticleDto.create({
    id: article.getId(),
    title: article.getTitle(),
    category: CategoryMapper.toDto(article.category),
    content: article.getContent(),
    visible: article.getVisible(),
    thumbnail: article.getThumbnail(),
    viewCount: article.getViewCount(),
    commentCount: article.commentCount,
    createdAt: article.createdAt,
    tags: article.tags.map((tag) => TagMapper.toDto(tag)),
    comments: article.comments.map((comment) => ArticleCommentMapper.toDto(comment)),
  });
