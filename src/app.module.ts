import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomPrismaModule } from 'nestjs-prisma';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import AppController from './app.controller';
import AppService from './app.service';
import { PRISMA_SERVICE, extendedPrismaClient } from './infra/database/prisma';
import AuthModule from './modules/auth/auth.module';
import UserModule from './modules/user/user.module';
import LoggerMiddleware from './common/middlewares/logger.middleware';
import JwtCookieMiddleware from './modules/auth/middlewares/jwt-cookie.middleware';
import JwtGuard from './modules/auth/guards/jwt.guard';
import TransformInterceptor from './common/interceptors/transform.interceptor';
import LocalStorageModule from './infra/local-storage/local-storage.module';
import { ILocalStorageService, LOCAL_STORAGE_SERVICE } from './infra/local-storage/interfaces/local-storage.interface';
import CategoryModule from './modules/category/category.module';
import ArticleModule from './modules/article/article.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    CustomPrismaModule.forRootAsync({
      imports: [LocalStorageModule],
      name: PRISMA_SERVICE,
      isGlobal: true,
      inject: [LOCAL_STORAGE_SERVICE],
      useFactory: (localStorageService: ILocalStorageService) => extendedPrismaClient(localStorageService),
    }),
    AuthModule,
    UserModule,
    CategoryModule,
    ArticleModule,
    LocalStorageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export default class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer
      .apply(JwtCookieMiddleware)
      .exclude({
        path: '/v1/oauth/google',
        method: RequestMethod.POST,
      })
      .forRoutes('*');
  }
}
