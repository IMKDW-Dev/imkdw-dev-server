import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import TokenService from './services/token.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [TokenService],
  exports: [TokenService],
})
export default class TokenModule {}
