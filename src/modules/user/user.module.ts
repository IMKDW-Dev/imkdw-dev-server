import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from './repository/user/user-repo.interface';
import UserRepository from './infra/user.repository';
import UserQueryService from './services/user-query.service';
import { USER_OAUTH_REPOSITORY } from './repository/oauth-provider/user-oauth-repo.interface';
import UserOAuthQueryService from './services/user-oauth-query.service';
import UserService from './services/user.service';
import { USER_ROLE_REPOSITORY } from './repository/role/user-role-repo.interface';
import UserRoleRepository from './infra/user-role.repository';
import UserOAuthRepository from './infra/user-oauth.repository';
import UserController from './controllers/user.controller';
import UserImageService from './services/user-image.service';
import ImageModule from '../../infra/image/image.module';
import StorageModule from '../../infra/storage/storage.module';

@Module({
  imports: [ImageModule, StorageModule],
  controllers: [UserController],
  providers: [
    UserQueryService,
    UserOAuthQueryService,
    UserService,
    UserImageService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: USER_OAUTH_REPOSITORY,
      useClass: UserOAuthRepository,
    },
    {
      provide: USER_ROLE_REPOSITORY,
      useClass: UserRoleRepository,
    },
  ],
  exports: [UserQueryService, UserOAuthQueryService, UserService],
})
export default class UserModule {}
