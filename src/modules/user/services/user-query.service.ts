import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../repository/user/user-repo.interface';
import { UserQueryFilter } from '../repository/user/user-query.filter';
import User from '../domain/models/user.model';

@Injectable()
export default class UserQueryService {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepositoy: IUserRepository) {}

  async findOne(filter: UserQueryFilter): Promise<User | null> {
    return this.userRepositoy.findOne(filter);
  }
}
