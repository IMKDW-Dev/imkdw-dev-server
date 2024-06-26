import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

import { IArticleRepository } from '../repository/article/article-repo.interface';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';
import { ArticleQueryFilter } from '../repository/article/article-query.filter';
import ArticleId from '../domain/vo/article-id.vo';
import User from '../../user/domain/models/user.model';
import { ArticleQueryOption } from '../repository/article/article-query.option';
import { TX } from '../../../@types/prisma/prisma.type';
import ArticleContent from '../domain/vo/article-content.vo';
import Article from '../domain/models/article.model';

type IArticle = Prisma.articlesGetPayload<{
  include: {
    category: true;
    articleTag: {
      include: {
        tags: true;
      };
    };
    articleComment: {
      include: {
        user: true;
        replies: {
          include: {
            user: true;
          };
        };
      };
    };
  };
}>;

const articleInclude = {
  category: true,
  articleTag: {
    include: {
      tags: true,
    },
  },
  articleComment: {
    include: {
      user: true,
      replies: {
        include: {
          user: true,
        },
      },
    },
    where: { parentId: null as number | null },
  },
} as const;

@Injectable()
export default class ArticleRepository implements IArticleRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: CustomPrismaService<ExtendedPrismaClient>) {}

  async findOne(query: ArticleQueryFilter): Promise<Article> {
    const row: IArticle = await this.prisma.client.articles.findFirst({
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
    const rows: IArticle[] = await this.prisma.client.articles.findMany({
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
      skip: (option.page - 1) * option.limit,
    });

    return rows.map((row) => this.toEntity(row));
  }

  async save(article: Article, tx: TX = this.prisma.client): Promise<Article> {
    const row: IArticle = await tx.articles.create({
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
    const row: IArticle = await this.prisma.client.articles.update({
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
    return this.prisma.client.articles.count({
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
    const rows = await this.prisma.client.articles.findMany({
      where: {
        ...(!query?.includePrivate && { visible: true }),
      },
      select: {
        id: true,
      },
    });

    return rows.map((row) => row.id);
  }

  async delete(article: Article, tx: TX = this.prisma.client): Promise<void> {
    await tx.articles.delete({ where: { id: article.getId() } });
  }

  private toEntity(row: IArticle): Article {}
}
