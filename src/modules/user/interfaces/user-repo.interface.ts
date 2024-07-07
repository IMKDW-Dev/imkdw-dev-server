import User from '../domain/models/user.model';

export interface UserQueryFilter {
  id?: string;
  email?: string;
  nickname?: string;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface IUserRepository {
  findOne(filter: UserQueryFilter): Promise<User | null>;
  save(user: User): Promise<User>;
  update(user: User): Promise<User>;
  count(): Promise<number>;
}
