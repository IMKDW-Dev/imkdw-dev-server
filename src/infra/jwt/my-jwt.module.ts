import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { MY_JWT_SERVICE } from './interfaces/my-jwt.interface';
import MyJwtService from './services/my-jwt.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    {
      provide: MY_JWT_SERVICE,
      useClass: MyJwtService,
    },
  ],
  exports: [MY_JWT_SERVICE],
})
export default class MyJwtModule {}
