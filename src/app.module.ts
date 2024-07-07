import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
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
import LoggingInterceptor from './common/interceptors/logging.interceptor';
import AlertModule from './infra/alert/alert.module';
import createClsModule from './common/modules/cls.module';
import createConfigModule from './common/modules/config.module';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    createClsModule(),
    createConfigModule(),
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
    AlertModule,
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
