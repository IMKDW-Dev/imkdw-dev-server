import Article from '../domain/entities/article.entity';
import ArticleDto from '../dto/article.dto';
import * as ArticleCommentMapper from './article-comment.mapper';
import * as CategoryMapper from '../../category/mappers/category.mapper';

// eslint-disable-next-line import/prefer-default-export
export const toDto = (article: Article) =>
  ArticleDto.create({
    id: article.id.toString(),
    title: article.title,
    category: CategoryMapper.toDto(article.category),
    content: article.content.getContent(),
    visible: article.visible,
    thumbnail: article.thumbnail,
    viewCount: article.viewCount,
    commentCount: article.commentCount,
    createdAt: article.createdAt,
    tags: article.tags.map((tag) => tag.toDto()),
    comments: article.comments.map((comment) => ArticleCommentMapper.toDto(comment)),
  });
