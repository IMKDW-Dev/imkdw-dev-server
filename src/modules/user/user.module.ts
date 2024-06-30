import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from './repository/user/user-repo.interface';
import UserRepository from './infra/user.repository';
import UserService from './services/user.service';
import UserController from './controllers/user.controller';
import UserImageService from './services/user-image.service';
import ImageModule from '../../infra/image/image.module';
import StorageModule from '../../infra/storage/storage.module';

@Module({
  imports: [ImageModule, StorageModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserImageService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [UserService],
})
export default class UserModule {}
