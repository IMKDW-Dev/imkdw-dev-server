import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

@Injectable()
export default class SitemapService {
  constructor(private readonly prisma: TransactionHost<TransactionalAdapterPrisma>) {}

  async getArticleIds(): Promise<string[]> {
    const articleIds = await this.prisma.tx.articles.findMany({ select: { id: true }, where: { visible: true } });
    return articleIds.map((article) => article.id);
  }

  async getCategoryNames(): Promise<string[]> {
    const categoryNames = await this.prisma.tx.categories.findMany({ select: { name: true } });
    return categoryNames.map((category) => category.name);
  }
}
