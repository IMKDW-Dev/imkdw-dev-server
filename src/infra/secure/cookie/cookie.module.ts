import { Module } from '@nestjs/common';
import { COOKIE_SERVICE } from './interfaces/cookie.interface';
import CookieService from './services/cookie.service';

@Module({
  providers: [
    {
      provide: COOKIE_SERVICE,
      useClass: CookieService,
    },
  ],
  exports: [COOKIE_SERVICE],
})
export default class CookieModule {}
