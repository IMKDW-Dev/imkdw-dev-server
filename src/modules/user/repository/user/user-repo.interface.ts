import { InjectionToken } from '@nestjs/common';
import { UserQueryFilter } from './user-query.filter';
import User from '../../domain/models/user.model';

export const USER_REPOSITORY: InjectionToken = Symbol('USER_REPOSITORY');

export interface IUserRepository {
  findOne(filter: UserQueryFilter): Promise<User | null>;
  save(user: User): Promise<User>;
  update(user: User): Promise<User>;
  count(): Promise<number>;
}
