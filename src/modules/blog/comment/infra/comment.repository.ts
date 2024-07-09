import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import * as UserMapper from '../../../user/mappers/user.mapper';

import { ArticleCommentQueryFilter } from '../repository/comment-query.filter';
import Comment from '../domain/models/comment.model';
import * as CommentMapper from '../mappers/comment.mapper';
import { ICommentRepository } from '../repository/comment-repo.interface';

type IArticleComment = Prisma.articleCommentsGetPayload<{
  include: {
    user: {
      include: {
        role: true;
        oAuthProvider: true;
      };
    };
    replies: {
      include: {
        user: {
          include: {
            role: true;
            oAuthProvider: true;
          };
        };
      };
    };
  };
}>;

const articleCommentInclude = {
  user: {
    include: {
      role: true,
      oAuthProvider: true,
    },
  },
  replies: {
    include: {
      user: {
        include: {
          role: true,
          oAuthProvider: true,
        },
      },
    },
  },
};

@Injectable()
export default class CommentRepository implements ICommentRepository {
  constructor(private readonly prisma: TransactionHost<TransactionalAdapterPrisma>) {}

  async findOne(filter: ArticleCommentQueryFilter): Promise<Comment> {
    const row: IArticleComment = await this.prisma.tx.articleComments.findFirst({
      where: filter,
      include: articleCommentInclude,
    });

    return this.toEntity(row);
  }

  async findMany(filter: ArticleCommentQueryFilter): Promise<Comment[]> {
    const rows: IArticleComment[] = await this.prisma.tx.articleComments.findMany({
      where: { ...filter, parentId: null },
      include: articleCommentInclude,
    });

    return rows.map((row) => this.toEntity(row));
  }

  async save(comment: Comment): Promise<Comment> {
    const row = await this.prisma.tx.articleComments.create({
      data: {
        articleId: comment.getArticleId(),
        ...(comment.getParent() && { parentId: comment.getParent().getId() }),
        content: comment.getContent(),
        userId: comment.getAuthorId(),
      },
      include: articleCommentInclude,
    });

    return this.toEntity(row);
  }

  async deleteByArticleId(articleId: string): Promise<void> {
    await this.prisma.tx.articleComments.deleteMany({
      where: { articleId },
    });
  }

  private toEntity(row: IArticleComment): Comment {
    const replies = row.replies.map((reply) => {
      const author = UserMapper.toModel(reply.user, reply.user.role, reply.user.oAuthProvider);
      return CommentMapper.toModel(reply, author, []);
    });

    const author = UserMapper.toModel(row.user, row.user.role, row.user.oAuthProvider);
    return CommentMapper.toModel(row, author, replies);
  }
}
