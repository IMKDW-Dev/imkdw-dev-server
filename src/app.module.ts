import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomPrismaModule } from 'nestjs-prisma';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import AppController from './app.controller';
import AppService from './app.service';
import { PRISMA_SERVICE } from './infra/database/prisma';
import AuthModule from './modules/auth/auth.module';
import UserModule from './modules/user/user.module';
import LoggerMiddleware from './common/middlewares/logger.middleware';
import JwtCookieMiddleware from './modules/auth/middlewares/jwt-cookie.middleware';
import JwtGuard from './modules/auth/guards/jwt.guard';
import TransformInterceptor from './common/interceptors/transform.interceptor';
import LocalStorageModule from './infra/local-storage/local-storage.module';
import CategoryModule from './modules/category/category.module';
import ArticleModule from './modules/article/article.module';
import AllExceptionsFilter from './common/exceptions/all-exception.filter';
import ContactModule from './modules/contact/contact.module';
import { prismaConfig } from './config/prisma.config';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    CustomPrismaModule.forRootAsync(prismaConfig),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
      plugins: [
        new ClsPluginTransactional({
          imports: [CustomPrismaModule.forRootAsync(prismaConfig)],
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: PRISMA_SERVICE,
          }),
        }),
      ],
    }),
    AuthModule,
    UserModule,
    CategoryModule,
    ArticleModule,
    ContactModule,
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
