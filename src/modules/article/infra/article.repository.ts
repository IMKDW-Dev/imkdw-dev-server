import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

import { IArticleRepository } from '../repository/article-repo.interface';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';
import Article from '../domain/entities/article.entity';
import { ArticleQueryFilter } from '../repository/article-query.filter';
import { UpdateArticleDto } from '../dto/internal/update-article.dto';
import ArticleId from '../domain/value-objects/article-id.vo';
import ArticleComment from '../../article-comment/domain/entities/article-comment.entity';
import User from '../../user/domain/entities/user.entity';
import Category from '../../category/domain/entities/category.entity';
import Tag from '../../tag/domain/entities/tag.entity';
import { ArticleQueryOption } from '../repository/article-query.option';

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
        ...(query?.id && { id: query.id.toString() }),
        ...(query?.category && { categoryId: query.category.id }),
      },
      include: articleInclude,
    });
    return row ? this.toEntity(row) : null;
  }

  async findMany(query: ArticleQueryFilter, option?: ArticleQueryOption): Promise<Article[]> {
    const rows: IArticle[] = await this.prisma.client.articles.findMany({
      where: {
        ...(query?.id && { id: query.id.toString() }),
        ...(query?.category && { categoryId: query.category.id }),
        ...(option.excludeId && { NOT: { id: option.excludeId.toString() } }),
        ...(option?.search && { title: { contains: option.search }, content: { contains: option.search } }),
      },
      include: articleInclude,
      orderBy: {
        ...option?.orderBy,
      },
      take: option?.limit,
      skip: (option.page - 1) * option.limit,
    });

    return rows.map((row) => this.toEntity(row));
  }

  async save(article: Article): Promise<Article> {
    const row: IArticle = await this.prisma.client.articles.create({
      include: articleInclude,
      data: {
        id: article.id.toString(),
        title: article.title,
        content: article.content,
        thumbnail: article.thumbnail,
        categoryId: article.category.id,
        visible: article.visible,
      },
    });

    return this.toEntity(row);
  }

  async update(id: ArticleId, data: UpdateArticleDto): Promise<Article> {
    const row: IArticle = await this.prisma.client.articles.update({
      where: { id: id.toString() },
      data: {
        title: data.title,
        content: data.content,
        thumbnail: data.thumbnail,
        visible: data.visible,
        viewCount: data.viewCount,
        commentCount: data.commentCount,
      },
      include: articleInclude,
    });

    return this.toEntity(row);
  }

  async findCounts(query: ArticleQueryFilter): Promise<number> {
    return this.prisma.client.articles.count({
      where: {
        ...(query?.id && { id: query.id.toString() }),
        ...(query?.category && { categoryId: query.category.id }),
      },
    });
  }

  private toEntity(row: IArticle): Article {
    const comments = row.articleComment.map((comment) => {
      const replies = comment.replies.map((reply) =>
        ArticleComment.create({
          id: reply.id,
          articleId: reply.articleId,
          author: User.create({ nickname: reply.user.nickname, profile: reply.user.profile }),
          content: reply.content,
          parentId: null,
          createdAt: reply.createdAt,
        }),
      );

      return ArticleComment.create({
        id: comment.id,
        articleId: comment.articleId,
        author: User.create({ nickname: comment.user.nickname, profile: comment.user.profile }),
        content: comment.content,
        parentId: null,
        replies,
        createdAt: comment.createdAt,
      });
    });

    const tags = row.articleTag.map((articleTag) =>
      Tag.create({
        id: articleTag.tags.id,
        name: articleTag.tags.name,
      }),
    );

    const category = Category.create({
      id: row.category.id,
      name: row.category.name,
      image: row.category.image,
      desc: row.category.desc,
      sort: row.category.sort,
    });

    return Article.create({
      id: new ArticleId(row.id),
      title: row.title,
      content: row.content,
      createdAt: row.createdAt,
      thumbnail: row.thumbnail,
      viewCount: row.viewCount,
      commentCount: row.commentCount,
      visible: row.visible,
      category,
      tags,
      comments,
    });
  }
}
