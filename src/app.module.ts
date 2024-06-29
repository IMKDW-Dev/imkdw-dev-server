import { ExecutionContext, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ClsModule, ClsService } from 'nestjs-cls';
import { Request } from 'express';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { ThrottlerModule } from '@nestjs/throttler';

import AppController from './app.controller';
import AppService from './app.service';
import AuthModule from './modules/auth/auth.module';
import UserModule from './modules/user/user.module';
import JwtCookieMiddleware from './modules/auth/middlewares/jwt-cookie.middleware';
import JwtGuard from './modules/auth/guards/jwt.guard';
import TransformInterceptor from './common/interceptors/transform.interceptor';
import CategoryModule from './modules/category/category.module';
import ArticleModule from './modules/article/article.module';
import AllExceptionsFilter from './common/exceptions/all-exception.filter';
import ContactModule from './modules/contact/contact.module';
import SitemapModule from './infra/sitemap/sitemap.module';
import LoggerModule from './infra/logger/logger.module';
import TokenModule from './modules/token/token.module';
import DatabaseModule from './infra/database/database.module';
import PrismaService from './infra/database/prisma.service';
import LoggingInterceptor from './common/interceptors/logging.interceptor';

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
      plugins: [
        new ClsPluginTransactional({
          imports: [DatabaseModule],
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: PrismaService,
          }),
        }),
      ],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    AuthModule,
    UserModule,
    CategoryModule,
    ArticleModule,
    ContactModule,
    SitemapModule,
    LoggerModule,
    TokenModule,
    DatabaseModule,
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
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export default class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtCookieMiddleware)
      .exclude({
        path: '/v1/oauth/google',
        method: RequestMethod.POST,
      })
      .forRoutes('*');
  }
}
