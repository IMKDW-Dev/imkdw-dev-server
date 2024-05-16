import { InjectionToken } from '@nestjs/common';
import UserRole from '../../domain/entities/user-role.entity';
import { UserRoleQueryFilter } from './user-role-query.filter';

export const USER_ROLE_REPOSITORY: InjectionToken = Symbol('USER_ROLE_REPOSITORY');

export interface IUserRoleRepository {
  findOne(where: UserRoleQueryFilter): Promise<UserRole | null>;
}
