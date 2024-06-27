import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { IArticleCommentRepository } from '../repository/article-comment/article-comment-repo.interface';
import { ArticleCommentQueryFilter } from '../repository/article-comment/article-comment-query.filter';
import ArticleComment from '../domain/models/article-comment.model';
import * as CommentMapper from '../mappers/article-comment.mapper';
import * as UserMapper from '../../user/mappers/user.mapper';

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
export default class ArticleCommentRepository implements IArticleCommentRepository {
  constructor(private readonly prisma: TransactionHost<TransactionalAdapterPrisma>) {}

  async findOne(filter: ArticleCommentQueryFilter): Promise<ArticleComment> {
    const row: IArticleComment = await this.prisma.tx.articleComments.findFirst({
      where: filter,
      include: articleCommentInclude,
    });

    return this.toEntity(row);
  }

  async findMany(filter: ArticleCommentQueryFilter): Promise<ArticleComment[]> {
    const rows: IArticleComment[] = await this.prisma.tx.articleComments.findMany({
      where: filter,
      include: articleCommentInclude,
    });

    return rows.map((row) => this.toEntity(row));
  }

  async save(comment: ArticleComment): Promise<ArticleComment> {
    const row = await this.prisma.tx.articleComments.create({
      data: {
        articleId: comment.getArticleId(),
        parentId: comment.getParent().getId(),
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

  private toEntity(row: IArticleComment): ArticleComment {
    const replies = row.replies.map((reply) => {
      const author = UserMapper.toModel(reply.user, reply.user.role, reply.user.oAuthProvider);
      return CommentMapper.toModel(reply, author, []);
    });

    const author = UserMapper.toModel(row.user, row.user.role, row.user.oAuthProvider);
    return CommentMapper.toModel(row, author, replies);
  }
}
