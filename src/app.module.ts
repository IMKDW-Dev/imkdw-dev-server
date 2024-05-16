import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomPrismaModule } from 'nestjs-prisma';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PRISMA_SERVICE, extendedPrismaClient } from './infra/database/prisma';
import AuthModule from './modules/auth/auth.module';
import UserModule from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    CustomPrismaModule.forRootAsync({
      name: PRISMA_SERVICE,
      isGlobal: true,
      useFactory: () => extendedPrismaClient,
    }),

    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule {}
