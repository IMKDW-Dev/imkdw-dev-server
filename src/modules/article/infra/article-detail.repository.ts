import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';
import { IArticleDetailRepository } from '../repository/article-detail-repo.interface';
import ArticleDetailDto, { ArticleDetailDtoBuilder } from '../dto/article-detail.dto';
import { ArticleQueryFilter } from '../repository/article-query.filter';
import TagDto from '../../tag/dto/tag.dto';
import ArticleCommentDetailDto, {
  ArticleCommentDetailDtoBuilder,
  CommentUserDto,
} from '../../article-comment/dto/article-comment-detail.dto';

type QueryResult = Prisma.articlesGetPayload<{
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
          include: {
            user: true;
          };
        };
      };
    };
  };
}>;

@Injectable()
export default class ArticleDetailRepository implements IArticleDetailRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: CustomPrismaService<ExtendedPrismaClient>) {}

  async findOne(filter: ArticleQueryFilter): Promise<ArticleDetailDto | null> {
    const row = await this.prisma.client.articles.findFirst({
      where: filter,
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
          where: {
            parentId: null,
          },
        },
      },
    });

    return row ? this.toDto(row) : null;
  }

  private toDto(row: QueryResult): ArticleDetailDto {
    const comments: ArticleCommentDetailDto[] = row.articleComment.map((comment): ArticleCommentDetailDto => {
      const replies = comment.replies.map((reply) =>
        new ArticleCommentDetailDtoBuilder()
          .setId(reply.id)
          .setContent(reply.content)
          .setAuthor(new CommentUserDto(reply.user.nickname, reply.user.profile))
          .setCreatedAt(reply.createdAt)
          .build(),
      );

      return new ArticleCommentDetailDtoBuilder()
        .setId(comment.id)
        .setContent(comment.content)
        .setAuthor(new CommentUserDto(comment.user.nickname, comment.user.profile))
        .setCreatedAt(comment.createdAt)
        .setReplies(replies)
        .build();
    });

    return new ArticleDetailDtoBuilder()
      .setId(row.id)
      .setTitle(row.title)
      .setContent(row.content)
      .setViewCount(row.viewCount)
      .setCreatedAt(row.createdAt)
      .setComments(comments)
      .setTags(row.articleTag.map((tag) => new TagDto(tag.tags.id, tag.tags.name)))
      .build();
  }
}
