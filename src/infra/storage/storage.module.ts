import { Module } from '@nestjs/common';
import { STORAGE_SERVICE } from './interfaces/storage.interface';
import AwsS3Service from './services/aws-s3.service';

@Module({
  providers: [
    {
      provide: STORAGE_SERVICE,
      useClass: AwsS3Service,
    },
  ],
  exports: [STORAGE_SERVICE],
})
export default class StorageModule {}
