import { articles } from '@prisma/client';

import ArticleDto from '../dto/article.dto';
import * as ArticleCommentMapper from './article-comment.mapper';
import * as CategoryMapper from '../../category/mappers/category.mapper';
import * as TagMapper from '../../tag/mappers/tag.mapper';
import Article from '../domain/models/article.model';
import ArticleContent from '../domain/vo/article/article-content.vo';
import Tag from '../../tag/domain/models/tag.model';
import Category from '../../category/domain/models/category.model';

export const toDto = (article: Article) => {
  return new ArticleDto.builder()
    .setId(article.getId())
    .setTitle(article.getTitle())
    .setContent(article.getContent())
    .setVisible(article.getVisible())
    .setThumbnail(article.getThumbnail())
    .setViewCount(article.getViewCount())
    .setCreatedAt(article.getCreatedAt())
    .setCategory(CategoryMapper.toDto(article.getCategory()))
    .setTags(article.getTags().map((tag) => TagMapper.toDto(tag)))
    .setComments(article.getComments().map((comment) => ArticleCommentMapper.toDto(comment)))
    .build();
};

export const toModel = (article: articles, category: Category, tags: Tag[]) => {
  return new Article.builder()
    .setId(article.id)
    .setTitle(article.title)
    .setCategory(category)
    .setContent(article.content)
    .setVisible(article.visible)
    .setThumbnail(article.thumbnail)
    .setViewCount(article.viewCount)
    .setCreatedAt(article.createdAt)
    .setTags(tags)
    .build();
};
