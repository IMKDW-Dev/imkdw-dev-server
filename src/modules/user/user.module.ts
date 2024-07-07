import { Module } from '@nestjs/common';
import UserRepository from './infra/user.repository';
import UserService from './services/user.service';
import UserController from './controllers/user.controller';
import UserImageService from './services/user-image.service';
import ImageModule from '../../infra/image/image.module';
import StorageModule from '../../infra/storage/storage.module';
import { USER_REPOSITORY } from './interfaces/user-repo.interface';
import CreateUserUseCase from './use-cases/create-user.use-case';

const useCases = [CreateUserUseCase];

const services = [UserService, UserImageService];

const repositories = [
  {
    provide: USER_REPOSITORY,
    useClass: UserRepository,
  },
];

@Module({
  imports: [ImageModule, StorageModule],
  controllers: [UserController],
  providers: [...useCases, ...services, ...repositories],
  exports: [UserService],
})
export default class UserModule {}
