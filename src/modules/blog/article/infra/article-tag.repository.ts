import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { IArticleTagRepository } from '../repository/article-tag-repo.inteface';
import ArticleTag from '../domain/models/article-tag.model';
import Article from '../domain/models/article.model';

@Injectable()
export default class ArticleTagRepository implements IArticleTagRepository {
  constructor(private readonly prisma: TransactionHost<TransactionalAdapterPrisma>) {}

  async createMany(article: Article, articleTags: ArticleTag[]): Promise<void> {
    await this.prisma.tx.articleTags.createMany({
      data: articleTags.map((articleTag) => ({
        articleId: article.getId().toString(),
        tagId: articleTag.getTagId(),
      })),
    });
  }

  async deleteByArticleId(articleId: string): Promise<void> {
    await this.prisma.tx.articleTags.deleteMany({ where: { articleId } });
  }
}
