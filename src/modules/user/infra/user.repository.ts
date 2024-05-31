import { Inject, Injectable } from '@nestjs/common';
import { users, userRoles, userOAuthProviders } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

import User from '../domain/entities/user.entity';
import { UserQueryFilter } from '../repository/user/user-query.filter';
import { IUserRepository } from '../repository/user/user-repo.interface';
import UserRole from '../domain/entities/user-role.entity';
import UserOAuthProvider from '../domain/entities/user-oauth-provider.entity';
import { ExtendedPrismaClient, PRISMA_SERVICE } from '../../../infra/database/prisma';

@Injectable()
export default class UserRepository implements IUserRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: CustomPrismaService<ExtendedPrismaClient>) {}

  async findOne(where: UserQueryFilter): Promise<User | null> {
    const row = await this.prisma.client.users.findFirst({
      where,
      include: { oAuthProvider: true, role: true },
    });

    if (!row) {
      return null;
    }

    return this.toEntity(row);
  }

  async save(user: User): Promise<User> {
    const row = await this.prisma.client.users.create({
      include: {
        role: true,
        oAuthProvider: true,
      },
      data: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        profile: user.profile,
        roleId: user.role.id,
        oAuthProviderId: user.oAuthProvider.id,
      },
    });

    return this.toEntity(row);
  }

  private toEntity(user: users & { role: userRoles; oAuthProvider: userOAuthProviders }): User {
    const role = UserRole.create({ id: user.role.id, name: user.role.name });
    const oAuthProvider = UserOAuthProvider.create({ id: user.oAuthProvider.id, provider: user.oAuthProvider.name });

    return User.create({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      profile: user.profile,
      role,
      oAuthProvider,
    });
  }
}
