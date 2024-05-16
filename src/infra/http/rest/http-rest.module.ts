import { Module } from '@nestjs/common';
import { HTTP_REST_SERVICE } from './interfaces/http-rest.interface';
import AxiosHttpRestService from './services/axios-http-rest.service';

@Module({
  providers: [
    {
      provide: HTTP_REST_SERVICE,
      useClass: AxiosHttpRestService,
    },
  ],
  exports: [HTTP_REST_SERVICE],
})
export default class HttpRestModule {}
