import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { IUserOAuthRepository } from '../repository/oauth-provider/user-oauth-repo.interface';
import UserOAuth from '../domain/entities/user-oauth-provider.entity';
import { UserOauthProviderQueryFilter } from '../repository/oauth-provider/user-oauth-provider-query.filter';
import { PRISMA_SERVICE } from '../../../infra/database/prisma';

@Injectable()
export default class UserOAuthRepository implements IUserOAuthRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: PrismaService) {}

  async findOne(where: UserOauthProviderQueryFilter): Promise<UserOAuth | null> {
    const row = await this.prisma.userOAuthProviders.findFirst({ where });
    return row ? new UserOAuth(row.id, row.name) : null;
  }
}
