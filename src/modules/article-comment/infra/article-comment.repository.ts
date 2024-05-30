import { CustomPrismaService } from 'nestjs-prisma';
import { Inject, Injectable } from '@nestjs/common';
import { Prisma, articleComment } from '@prisma/client';

import { IArticleCommentRepository } from '../repository/article-comment-repo.interface';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';
import ArticleComment, { ArticleCommentBuilder } from '../domain/entities/article-comment.entity';
import { ArticleCommentQueryFilter } from '../repository/article-comment-query.filter';
import ArticleCommentDetailDto, {
  ArticleCommentDetailDtoBuilder,
  CommentUserDto,
} from '../dto/article-comment-detail.dto';

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

  async save(comment: ArticleComment): Promise<ArticleCommentDetailDto> {
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

  private toDetail(comment: FindDetailResult, commentReplies: FindDetailResult[]): ArticleCommentDetailDto {
    console.log('comment', comment);
    console.log('commentReplies', commentReplies);
    const replies = commentReplies.map((reply) =>
      new ArticleCommentDetailDtoBuilder()
        .setId(reply.id)
        .setParentId(reply.parentId)
        .setAuthor(new CommentUserDto(reply.user.nickname, reply.user.profile))
        .setContent(reply.content)
        .setCreatedAt(reply.createdAt)
        .build(),
    );

    return new ArticleCommentDetailDtoBuilder()
      .setId(comment.id)
      .setParentId(comment.parentId)
      .setAuthor(new CommentUserDto(comment.user.nickname, comment.user.profile))
      .setContent(comment.content)
      .setCreatedAt(comment.createdAt)
      .setReplies(replies)
      .build();
  }
}
