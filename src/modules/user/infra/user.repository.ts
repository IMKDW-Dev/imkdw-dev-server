import { Inject, Injectable } from '@nestjs/common';
import { users, userRoles, userOAuthProviders } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import User, { UserBuilder } from '../domain/entities/user.entity';
import { UserQueryFilter } from '../repository/user/user-query.filter';
import { IUserRepository } from '../repository/user/user-repo.interface';
import UserRole from '../domain/entities/user-role.entity';
import UserOAuthProvider from '../domain/entities/user-oauth-provider.entity';
import { PRISMA_SERVICE } from '../../../infra/database/prisma';

@Injectable()
export default class UserRepository implements IUserRepository {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: PrismaService) {}

  async findOne(where: UserQueryFilter): Promise<User | null> {
    const row = await this.prisma.users.findFirst({
      where,
      include: { oAuthProvider: true, role: true },
    });

    if (!row) {
      return null;
    }

    return this.toEntity(row);
  }

  async save(user: User): Promise<User> {
    const row = await this.prisma.users.create({
      include: {
        role: true,
        oAuthProvider: true,
      },
      data: {
        id: user.getId(),
        email: user.getEmail(),
        nickname: user.getNickname(),
        profile: user.getProfile(),
        roleId: user.getRole().getId(),
        oAuthProviderId: user.getOAuthProvider().getId(),
      },
    });

    return this.toEntity(row);
  }

  private toEntity(user: users & { role: userRoles; oAuthProvider: userOAuthProviders }): User {
    return new UserBuilder()
      .setId(user.id)
      .setEmail(user.email)
      .setNickname(user.nickname)
      .setProfile(user.profile)
      .setRole(new UserRole(user.role.id, user.role.name))
      .setOAuthProvider(new UserOAuthProvider(user.oAuthProvider.id, user.oAuthProvider.name))
      .build();
  }
}
