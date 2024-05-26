import { CustomPrismaService } from 'nestjs-prisma';
import { Inject, Injectable } from '@nestjs/common';
import { Prisma, articleComment } from '@prisma/client';

import { IArticleCommentRepository } from '../repository/article-comment-repo.interface';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';
import ArticleComment, { ArticleCommentBuilder } from '../domain/entities/article-comment.entity';
import { ArticleCommentQueryFilter } from '../repository/article-comment-query.filter';
import ArticleCommentDetail, { ArticleCommentDetailBuilder } from '../domain/entities/article-comment-detail.entity';
import { UserBuilder } from '../../user/domain/entities/user.entity';

type FindDetailResult = Prisma.articleCommentGetPayload<{
  include: {
    user: true;
  };
}>;

@Injectable()
export default class ArticleCommentRepository implements IArticleCommentRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: CustomPrismaService<ExtendedPrismaClient>) {}

  async findOne(filter: ArticleCommentQueryFilter): Promise<ArticleComment> {
    const row = await this.prisma.client.articleComment.findFirst({
      where: filter,
    });

    return this.toEntity(row);
  }

  async save(comment: ArticleComment): Promise<ArticleCommentDetail> {
    const row = await this.prisma.client.articleComment.create({
      data: {
        articleId: comment.getArticleId(),
        parentId: comment.getParentId(),
        content: comment.getContent(),
        userId: comment.getUserId(),
      },
      include: {
        user: true,
      },
    });

    const replies = await this.prisma.client.articleComment.findMany({
      where: { parentId: row.id },
      include: { user: true },
    });

    return this.toDetail(row, replies);
  }

  private toEntity(row: articleComment): ArticleComment {
    return new ArticleCommentBuilder()
      .setId(row.id)
      .setArticleId(row.articleId)
      .setParentId(row.parentId)
      .setContent(row.content)
      .build();
  }

  private toDetail(comment: FindDetailResult, commentReplies: FindDetailResult[]): ArticleCommentDetail {
    const replies = commentReplies.map((reply) =>
      new ArticleCommentDetailBuilder()
        .setId(reply.id)
        .setAuthor(
          new UserBuilder()
            .setId(reply.user.id)
            .setEmail(reply.user.email)
            .setNickname(reply.user.nickname)
            .setProfile(reply.user.profile)
            .build(),
        )
        .setContent(reply.content)
        .setCreatedAt(reply.createdAt)
        .build(),
    );

    return new ArticleCommentDetailBuilder()
      .setId(comment.id)
      .setAuthor(
        new UserBuilder()
          .setId(comment.user.id)
          .setEmail(comment.user.email)
          .setNickname(comment.user.nickname)
          .setProfile(comment.user.profile)
          .build(),
      )
      .setContent(comment.content)
      .setCreatedAt(comment.createdAt)
      .setReplies(replies)
      .build();
  }
}
