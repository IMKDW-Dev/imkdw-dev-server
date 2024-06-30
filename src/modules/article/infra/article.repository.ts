import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { IArticleRepository } from '../repository/article/article-repo.interface';
import { ArticleQueryFilter } from '../repository/article/article-query.filter';
import { ArticleQueryOption } from '../repository/article/article-query.option';
import Article from '../domain/models/article.model';

import * as CategoryMapper from '../../category/mappers/category.mapper';
import * as TagMapper from '../../tag/mappers/tag.mapper';
import * as ArticleMapper from '../mappers/article.mapper';

export type IArticle = Prisma.articlesGetPayload<{
  include: {
    category: true;
    articleTag: {
      include: {
        tags: true;
      };
    };
  };
}>;

export const articleInclude = {
  category: true,
  articleTag: {
    include: {
      tags: true,
    },
  },
} as const;

@Injectable()
export default class ArticleRepository implements IArticleRepository {
  constructor(private readonly prisma: TransactionHost<TransactionalAdapterPrisma>) {}

  async findOne(query: ArticleQueryFilter): Promise<Article> {
    const row: IArticle = await this.prisma.tx.articles.findFirst({
      where: {
        ...(query?.articleId && { id: query.articleId }),
        ...(query?.categoryId && { categoryId: query.categoryId }),
        ...(!query?.includePrivate && { visible: true }),
      },
      include: articleInclude,
    });
    return row ? this.toEntity(row) : null;
  }

  async findMany(query: ArticleQueryFilter, option?: ArticleQueryOption): Promise<Article[]> {
    const rows: IArticle[] = await this.prisma.tx.articles.findMany({
      where: {
        ...(query?.articleId && { id: query.articleId }),
        ...(query?.categoryId && { categoryId: query.categoryId }),
        ...(option?.excludeId && { NOT: { id: option.excludeId.toString() } }),
        ...(!query?.includePrivate && { visible: true }),
        ...(option?.search && {
          OR: [
            {
              title: { contains: option.search },
            },
            {
              content: { contains: option.search },
            },
            {
              id: { contains: option.search },
            },
          ],
        }),
      },
      include: articleInclude,
      orderBy: { ...option?.orderBy },
      take: option?.limit,
      ...(option?.page && { skip: (option.page - 1) * option.limit }),
    });

    return rows.map((row) => this.toEntity(row));
  }

  async save(article: Article): Promise<Article> {
    const row: IArticle = await this.prisma.tx.articles.create({
      include: articleInclude,
      data: {
        id: article.getId(),
        title: article.getTitle(),
        content: article.getContent(),
        thumbnail: article.getThumbnail(),
        categoryId: article.getCategoryId(),
        visible: article.getVisible(),
      },
    });

    return this.toEntity(row);
  }

  async update(article: Article): Promise<Article> {
    const row: IArticle = await this.prisma.tx.articles.update({
      where: { id: article.getId() },
      data: {
        title: article.getTitle(),
        content: article.getContent(),
        thumbnail: article.getThumbnail(),
        visible: article.getVisible(),
        viewCount: article.getViewCount(),
        categoryId: article.getCategoryId(),
      },
      include: articleInclude,
    });

    return this.toEntity(row);
  }

  async findCounts(query: ArticleQueryFilter, option?: ArticleQueryOption): Promise<number> {
    return this.prisma.tx.articles.count({
      where: {
        ...(query?.articleId && { id: query.articleId }),
        ...(query?.categoryId && { categoryId: query.categoryId }),
        ...(option?.excludeId && { NOT: { id: option.excludeId.toString() } }),
        ...(option?.search && {
          title: { contains: option.search },
          content: { contains: option.search },
          id: { contains: option.search },
        }),
      },
    });
  }

  async findIds(query: ArticleQueryFilter): Promise<string[]> {
    const rows = await this.prisma.tx.articles.findMany({
      where: {
        ...(!query?.includePrivate && { visible: true }),
      },
      select: {
        id: true,
      },
    });

    return rows.map((row) => row.id);
  }

  async delete(article: Article): Promise<void> {
    await this.prisma.tx.articles.delete({ where: { id: article.getId() } });
  }

  private toEntity(row: IArticle): Article {
    const category = CategoryMapper.toModel(row.category);
    const tags = row.articleTag.map((articleTag) => TagMapper.toModel(articleTag.tags));
    return ArticleMapper.toModel(row, category, tags);
  }
}
