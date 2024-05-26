import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

import { IArticleRepository } from '../repository/article-repo.interface';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';
import Article, { ArticleBuilder } from '../domain/entities/article.entity';
import { ArticleQueryFilter } from '../repository/article-query.filter';
import { CategoryBuilder } from '../../category/domain/entities/category.entity';
import ArticleDetail, { ArticleDetailBuilder } from '../domain/entities/article-detail.entity';
import { TagBuilder } from '../../tag/domain/entities/tag.entity';
import { UpdateArticleDto } from '../dto/internal/update-article.dto';
import { ArticleCommentDetailBuilder } from '../../article-comment/domain/entities/article-comment-detail.entity';
import { UserBuilder } from '../../user/domain/entities/user.entity';

type FindOneResult = Prisma.articlesGetPayload<{
  include: {
    category: true;
    articleTag: {
      include: {
        tags: true;
      };
    };
  };
}>;

type FindDetailResult = Prisma.articlesGetPayload<{
  include: {
    articleTag: {
      include: {
        tags: true;
      };
    };
    articleComment: {
      include: {
        user: true;
        replies: {
          include: { user: true };
        };
      };
    };
  };
}>;

@Injectable()
export default class ArticleRepository implements IArticleRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: CustomPrismaService<ExtendedPrismaClient>) {}

  async findOne(query: ArticleQueryFilter): Promise<Article> {
    const row: FindOneResult = await this.prisma.client.articles.findFirst({
      where: { ...query },
      include: { category: true, articleTag: { include: { tags: true } } },
    });

    return row ? this.toEntity(row) : null;
  }

  async save(article: Article): Promise<Article> {
    const row = await this.prisma.client.articles.create({
      data: {
        id: article.getId(),
        title: article.getTitle(),
        content: article.getContent(),
        thumbnail: article.getThumbnail(),
        categoryId: article.getCategory().getId(),
        visible: article.getVisible(),
      },
      include: { category: true, articleTag: { include: { tags: true } } },
    });

    return this.toEntity(row);
  }

  async findArticleDetail(query: ArticleQueryFilter): Promise<ArticleDetail> {
    const row: FindDetailResult = await this.prisma.client.articles.findFirst({
      where: query,
      include: {
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
        },
      },
    });

    return row ? this.toDetail(row) : null;
  }

  async update(article: Article, data: UpdateArticleDto): Promise<Article> {
    const row = await this.prisma.client.articles.update({
      where: { id: article.getId() },
      data: {
        title: data.title,
        content: data.content,
        thumbnail: data.thumbnail,
        visible: data.visible,
      },
      include: { category: true, articleTag: { include: { tags: true } } },
    });

    return this.toEntity(row);
  }

  private toEntity(row: FindOneResult): Article {
    const category = new CategoryBuilder()
      .setId(row.category.id)
      .setName(row.category.name)
      .setDesc(row.category.desc)
      .setImage(row.category.image)
      .setSort(row.category.sort)
      .build();

    return new ArticleBuilder()
      .setId(row.id)
      .setTitle(row.title)
      .setContent(row.content)
      .setCategory(category)
      .setViewCount(row.viewCount)
      .setCommentCount(row.commentCount)
      .setThumbnail(row.thumbnail)
      .setCreatedAt(row.createdAt)
      .build();
  }

  private toDetail(row: FindDetailResult): ArticleDetail {
    const tags = row.articleTag.map((item) => new TagBuilder().setId(item.tags.id).setName(item.tags.name).build());

    const comments = row.articleComment.map((item) => {
      const replies = item.replies.map((reply) =>
        new ArticleCommentDetailBuilder()
          .setId(reply.id)
          .setAuthor(new UserBuilder().setNickname(reply.user.nickname).setProfile(reply.user.profile).build())
          .setContent(reply.content)
          .setCreatedAt(reply.createdAt)
          .setReplies([])
          .build(),
      );

      return new ArticleCommentDetailBuilder()
        .setId(item.id)
        .setAuthor(new UserBuilder().setNickname(item.user.nickname).setProfile(item.user.profile).build())
        .setContent(item.content)
        .setCreatedAt(item.createdAt)
        .setReplies(replies)
        .build();
    });

    return new ArticleDetailBuilder()
      .setId(row.id)
      .setTitle(row.title)
      .setContent(row.content)
      .setViewCount(row.viewCount)
      .setTags(tags)
      .setComments(comments)
      .setCreatedAt(row.createdAt)
      .setThumbnail(row.thumbnail)
      .build();
  }
}
