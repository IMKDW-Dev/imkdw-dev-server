import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { IUserOAuthRepository } from '../repository/oauth-provider/user-oauth-repo.interface';
import UserOAuthProvider from '../domain/models/user-oauth-provider.model';
import { UserOauthProviderQueryFilter } from '../repository/oauth-provider/user-oauth-provider-query.filter';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';

@Injectable()
export default class UserOAuthRepository implements IUserOAuthRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: CustomPrismaService<ExtendedPrismaClient>) {}

  async findOne(where: UserOauthProviderQueryFilter): Promise<UserOAuthProvider | null> {
    const row = await this.prisma.client.userOAuthProviders.findFirst({ where });
    return row ? UserOAuthProvider.create({ id: row.id, provider: row.name }) : null;
  }
}
