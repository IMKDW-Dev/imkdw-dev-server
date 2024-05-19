import { Module } from '@nestjs/common';
import { LOCAL_STORAGE_SERVICE } from './interfaces/local-storage.interface';
import LocalStorageService from './services/local-storage.service';

@Module({
  providers: [
    {
      provide: LOCAL_STORAGE_SERVICE,
      useClass: LocalStorageService,
    },
  ],
  exports: [LOCAL_STORAGE_SERVICE],
})
export default class LocalStorageModule {}
