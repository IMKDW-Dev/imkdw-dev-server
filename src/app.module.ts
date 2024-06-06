import { ExecutionContext, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomPrismaModule } from 'nestjs-prisma';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ClsModule, ClsService } from 'nestjs-cls';
import { Request } from 'express';

import AppController from './app.controller';
import AppService from './app.service';
import AuthModule from './modules/auth/auth.module';
import UserModule from './modules/user/user.module';
import LoggerMiddleware from './common/middlewares/logger.middleware';
import JwtCookieMiddleware from './modules/auth/middlewares/jwt-cookie.middleware';
import JwtGuard from './modules/auth/guards/jwt.guard';
import TransformInterceptor from './common/interceptors/transform.interceptor';
import CategoryModule from './modules/category/category.module';
import ArticleModule from './modules/article/article.module';
import AllExceptionsFilter from './common/exceptions/all-exception.filter';
import ContactModule from './modules/contact/contact.module';
import { PRISMA_SERVICE, extendedPrismaClient } from './infra/database/prisma';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    ClsModule.forRoot({
      global: true,
      interceptor: {
        mount: true,
        setup: (cls: ClsService, context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest<Request>();
          const userId = request.user?.userId;
          cls.set('userId', userId);
        },
      },
    }),
    CustomPrismaModule.forRootAsync({
      name: PRISMA_SERVICE,
      isGlobal: true,
      imports: [ClsModule],
      inject: [ClsService],
      useFactory: (cls: ClsService) => extendedPrismaClient(cls),
    }),
    AuthModule,
    UserModule,
    CategoryModule,
    ArticleModule,
    ContactModule,
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
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
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
