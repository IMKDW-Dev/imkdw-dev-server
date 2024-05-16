import { Module } from '@nestjs/common';
import { MY_JWT_SERVICE } from './interfaces/my-jwt.interface';
import MyJwtService from './services/my-jwt.service';

@Module({
  providers: [
    {
      provide: MY_JWT_SERVICE,
      useClass: MyJwtService,
    },
  ],
  exports: [MY_JWT_SERVICE],
})
export default class MyJwtModule {}
