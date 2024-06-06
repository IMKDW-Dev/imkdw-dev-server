import { CustomPrismaService } from 'nestjs-prisma';
import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { IArticleCommentRepository } from '../repository/article-comment/article-comment-repo.interface';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';
import { ArticleCommentQueryFilter } from '../repository/article-comment/article-comment-query.filter';
import User from '../../user/domain/entities/user.entity';
import ArticleComment from '../domain/article-comment.entity';
import { TX } from '../../../@types/prisma/prisma.type';

type IArticleComment = Prisma.articleCommentsGetPayload<{
  include: {
    user: true;
    replies: {
      include: {
        user: true;
      };
    };
  };
}>;

const articleCommentInclude = {
  user: true,
  replies: {
    include: {
      user: true,
    },
  },
};

@Injectable()
export default class ArticleCommentRepository implements IArticleCommentRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: CustomPrismaService<ExtendedPrismaClient>) {}

  async findOne(filter: ArticleCommentQueryFilter): Promise<ArticleComment> {
    const row: IArticleComment = await this.prisma.client.articleComments.findFirst({
      where: filter,
      include: articleCommentInclude,
    });

    return this.toEntity(row);
  }

  async save(comment: ArticleComment): Promise<ArticleComment> {
    const row = await this.prisma.client.articleComments.create({
      data: {
        articleId: comment.articleId,
        parentId: comment.parentId,
        content: comment.content,
        userId: comment.author.id,
      },
      include: articleCommentInclude,
    });

    return this.toEntity(row);
  }

  async deleteByArticleId(articleId: string, tx: TX = this.prisma.client): Promise<void> {
    await tx.articleComments.deleteMany({
      where: { articleId },
    });
  }

  private toEntity(row: IArticleComment): ArticleComment {
    const replies = row.replies.map((reply) =>
      ArticleComment.create({
        id: reply.id,
        articleId: reply.articleId,
        author: User.create({
          nickname: reply.user.nickname,
          profile: reply.user.profile,
        }),
        content: reply.content,
        parentId: reply.parentId,
        replies: [],
        createdAt: reply.createdAt,
      }),
    );

    return ArticleComment.create({
      id: row.id,
      articleId: row.articleId,
      author: User.create({
        nickname: row.user.nickname,
        profile: row.user.profile,
      }),
      content: row.content,
      parentId: row.parentId,
      replies,
      createdAt: row.createdAt,
    });
  }
}
