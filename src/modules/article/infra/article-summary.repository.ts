import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';
import { IArticleSummaryRepository } from '../repository/article-summary-repo.interface';

@Injectable()
export default class ArticleSummaryRepository implements IArticleSummaryRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: CustomPrismaService<ExtendedPrismaClient>) {}
}
