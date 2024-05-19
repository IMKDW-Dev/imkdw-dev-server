import { Module } from '@nestjs/common';
import ImageService from './services/image.service';
import { IMAGE_SERVICE } from './interfaces/image.interface';

@Module({
  providers: [
    {
      provide: IMAGE_SERVICE,
      useClass: ImageService,
    },
  ],
  exports: [IMAGE_SERVICE],
})
export default class ImageModule {}
