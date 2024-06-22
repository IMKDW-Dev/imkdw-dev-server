import { Module } from '@nestjs/common';

import TokenService from './services/token.service';
import MyJwtModule from '../../infra/jwt/my-jwt.module';

@Module({
  imports: [MyJwtModule],
  providers: [TokenService],
  exports: [TokenService],
})
export default class TokenModule {}
